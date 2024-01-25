import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PeriodicElement, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule, RouterModule, CommonModule, MatCardModule ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  providers:[JwtHelperService]
})


export class AccountComponent implements OnInit {
  hidePassword: boolean = true;
  accountForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, public userService: UserService, private jwtHelper: JwtHelperService) {

    this.accountForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    
  }

  ngOnInit(): void {
    const username = this.getUserData();

    // Assuming getUserByUsername is a method in your UserService
    this.userService.getUserByUsername(username).subscribe((user:PeriodicElement) => {
      this.accountForm = this.formBuilder.group({
        username: [user.username, [Validators.required, Validators.minLength(3)]],
        email: [user.email, [Validators.required, Validators.email]],
        firstName: [user.firstName, Validators.required],
        lastName: [user.lastName, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    });
  }
  
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  };

  getUserData(): string {
    const token = localStorage.getItem('access_token');

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const username: string = decodedToken.sub;
      console.log(username);

      return username;
    } else {
      throw new Error('No access token available.');
    }
  }

  saveUser(){
    const userData = this.accountForm.value;
    console.log(userData);
    this.userService.saveUser(userData).subscribe(
      (response: any)=>{
        console.log('User saved successfully', response)
      },
      (error: any) =>{
        console.error('Error saving user', error);
      }
    )
  }
  
}
