import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApi } from '../../../../api';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { mustMatchValidator } from '../../../../functions/validators/must-match';
import { RegisterService } from './../../../../services/register.service';
import { LoginService } from 'projects/storefront/src/app/services/login.service';
import { UserAuthService } from './../../../../services/user-auth.service';

@Component({
    selector: 'app-page-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss'],
})
export class PageLoginComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    loginForm!: FormGroup;
    loginInProgress = false;

    registerForm!: FormGroup;
    registerInProgress = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private account: AccountApi,
        private registerService: RegisterService,
        private loginService: LoginService,
        private UserAuthService: UserAuthService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['user@example.com', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            remember: [false],
        });

        this.registerForm = this.fb.group({
            name: ['usuario', [Validators.required]],
            email: ['user@example.com', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        }, { validators: [mustMatchValidator('password', 'confirmPassword')] });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    login(): void {
        this.loginForm.markAllAsTouched();

        if (this.loginInProgress || this.loginForm.invalid) {
            return;
        }

        this.loginInProgress = true;


        this.loginService.login(this.loginForm.value).pipe(
            finalize(() => this.loginInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(
            (data: any) => {
                this.UserAuthService.removeToken();
                console.log('login data:', data);
                console.log('Response:', data.status);
                this.UserAuthService.setToken(data.token);
                const user = {
                    email: data.user.email,
                    phone: '38 972 588-42-36',
                    firstName: data.user.name,
                    lastName: 'Ford',
                    avatar: '//www.gravatar.com/avatar/bde30b7dd579b3c9773f80132523b4c3?d=mp&s=88',
                };
                localStorage.setItem('user', JSON.stringify(user));
                this.router.navigateByUrl('/account/dashboard');
            },
            error => console.log('Error registering user'),
        );
    }

    register(): void {
        this.registerForm.markAllAsTouched();

        if (this.registerInProgress || this.registerForm.invalid) {
            return;
        }

        this.registerInProgress = true;

        this.registerService.register(this.registerForm.value).pipe(
            finalize(() => this.registerInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(
            (data: any) => {
                console.log('Registered data:', data);
                console.log('Response:', data.status);
            },
            error => console.log('Error registering user'),
        );
    }

    login2(): void {
        this.loginForm.markAllAsTouched();

        if (this.loginInProgress || this.loginForm.invalid) {
            return;
        }

        this.loginInProgress = true;

        this.account.signIn(
            this.loginForm.value.email,
            this.loginForm.value.password,
        ).pipe(
            finalize(() => this.loginInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(
            () => this.router.navigateByUrl('/account/dashboard'),
            error => {
                if (error instanceof HttpErrorResponse) {
                    this.loginForm.setErrors({
                        server: `ERROR_API_${error.error.message}`,
                    });
                } else {
                    alert(error);
                }
            },
        );
    }
    register2(): void {
        this.registerForm.markAllAsTouched();

        if (this.registerInProgress || this.registerForm.invalid) {
            return;
        }

        this.registerInProgress = true;

        this.account.signUp(
            this.registerForm.value.email,
            this.registerForm.value.password,
        ).pipe(
            finalize(() => this.registerInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(
            () => this.router.navigateByUrl('/account/dashboard'),
            error => {
                if (error instanceof HttpErrorResponse) {
                    this.registerForm.setErrors({
                        server: `ERROR_API_${error.error.message}`,
                    });
                } else {
                    alert(error);
                }
            },
        );
    }
}
