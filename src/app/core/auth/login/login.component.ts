import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.myForm = this.builder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {

    if (this.myForm.invalid) {
      alert('Please enter credentials to access');
      return;
    }
    this.isLoading = true;
    this.http.post<any>(
      `${environment.apiUrl}/auth/login`,
      this.myForm.value
    ).subscribe({
      next: (res) => {

        // ✅ SUCCESS
        if (res && res.user) {
          localStorage.setItem('email', res.user.email);
          localStorage.setItem('fullname', res.user.fullname);
          localStorage.setItem('password', res.user.password);

          this.myForm.reset();
          this.router.navigate(['/home']);
          this.isLoading = false;
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Invalid email or password');
        this.myForm.reset();
        this.router.navigate(['/home']);
        this.isLoading = false
      }
    });
  }
}
