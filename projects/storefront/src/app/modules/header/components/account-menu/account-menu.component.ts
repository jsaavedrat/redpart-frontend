import { Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountApi } from '../../../../api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LogoutService } from 'projects/storefront/src/app/services/logout.service';

@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    isAuth$: Observable<boolean>;
    firstName$: Observable<string | null>;
    lastName$: Observable<string | null>;
    email$: Observable<string | null>;
    avatar$: Observable<string | null>;

    form!: FormGroup;

    loginInProgress = false;

    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    @HostBinding('class.account-menu') classAccountMenu = true;

    constructor(
        private fb: FormBuilder,
        public account: AccountApi,
        public router: Router,
        private LogoutService: LogoutService
    ) {
        this.isAuth$ = this.account.user$.pipe(map(x => x !== null));
        this.firstName$ = this.account.user$.pipe(map(x => x ? x.firstName : null));
        this.lastName$ = this.account.user$.pipe(map(x => x ? x.lastName : null));
        this.email$ = this.account.user$.pipe(map(x => x ? x.email : null));
        this.avatar$ = this.account.user$.pipe(map(x => x ? x.avatar : null));
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            email: ['red-parts@example.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required]],
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    login(): void {
        this.form.markAllAsTouched();

        if (this.loginInProgress || this.form.invalid) {
            return;
        }

        this.loginInProgress = true;

        this.account.signIn(
            this.form.value.email,
            this.form.value.password,
        ).pipe(
            finalize(() => this.loginInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(
            () => {
                this.router.navigateByUrl('/account/dashboard').then();
                this.closeMenu.emit();
            },
            error => {
                if (error instanceof HttpErrorResponse) {
                    this.form.setErrors({
                        server: `ERROR_API_${error.error.message}`,
                    });
                } else {
                    alert(error);
                }
            },
        );
    }

    logout() {
        const token = localStorage.getItem('auth_token') ?? '';
        this.LogoutService.logout(token).subscribe(
            (data: any) => {
                if (data.status === 200) {
                    localStorage.removeItem('auth_token');
                };
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    logout2(): void {
        this.account.signOut().subscribe(() => {
            this.closeMenu.emit();
            this.router.navigateByUrl('/account/login').then();
        });
    }
}
