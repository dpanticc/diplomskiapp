import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from 'src/app/services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from 'src/app/services/register/register.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule, RouterModule, CommonModule ],
  providers: [LoginService, RegisterService, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, NotificationService, DialogService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  
  public switchForm:boolean = true;
  hidePassword: boolean = true;


  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private registerService: RegisterService, 
    private jwtHelper: JwtHelperService, private router: Router, private notificationService: NotificationService, private dialogService: DialogService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    
  }
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  
  title = 'reservationapp';

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    console.log("Init");
  }

  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  };

  onSubmitLogin(){

    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value).subscribe(
        (response) => {
            console.log('Logged in successfully!', response);
            this.notificationService.getMessage("Welcome!")
            // Decode the JWT to access claims
            const decodedToken = this.jwtHelper.decodeToken(response.access_token);
    
            // Access the roles claim
            const roles = decodedToken.roles;
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);

            //check if the user is an admin or a regular user
            if (roles.includes('ADMIN')) {
              console.log('User is an admin');
              // Redirect or perform actions for admin
              this.router.navigate(['/admin-home']);
            } else {
              console.log('User is a regular user');
              // Redirect or perform actions for regular user
              this.router.navigate(['/home']);
            }
        },
        (error) => {
          console.error("Login failed", error);
          this.notificationService.getMessage("Invalid username or password");
        }

      );
    }else{
      console.error("Login failed");
      this.notificationService.getMessage("Invalid username or password");   
    }
  };

  onSubmitRegister(){
        
    if(this.registerForm.valid){
        this.registerService.register(this.registerForm.value).subscribe(
          (response) => {
            console.log(response);
            this.notificationService.getMessage("Successfuly registered. Please verify your email!")
            this.switchForm = !this.switchForm;
          },
            (error) => {
            console.log(error);
            this.notificationService.getMessage("Invalid register information!");
          }
        )
      }else{
        this.notificationService.getMessage("Invalid register information!");
      }  
  }

  toggleForm(){
    if(this.switchForm == true){
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
          });

    }else{
        this.registerForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
          });
    }
    this.switchForm = !this.switchForm;

    if(this.hidePassword == false){
        this.hidePassword = true;
    }
  }

  openDialog(){
    this.dialogService.getMessage("Naslov");
  }
}