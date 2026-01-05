import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      mobilenumber: ['', Validators.required]

    })
  }

  signUp() {
    this.http.post<any>(
      `${environment.apiUrl}/auth/signup`,
      this.signupForm.value
    ).subscribe({
      next: () => {
        alert('Signup successful');
        this.signupForm.reset();
        this.router.navigate(['login']);
      },
      error: err => {
        alert(err.error.message || 'Signup failed');
      }
    });
  }


}
