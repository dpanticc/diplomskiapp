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
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from 'src/app/services/register/register.service';


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
  providers: [LoginService, RegisterService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  
  public promenljiva:boolean = true;
  hidePassword: boolean = true;


  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private registerService: RegisterService) {
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
        }
      )
    }else{

    }

  };

  onSubmitRegister(){
    
    if(this.registerForm.valid){
        this.registerService.register(this.registerForm.value).subscribe(
          (response) => {
            console.log('Registered in successfully!', response);
          }
        )
      }else{
  
      }  
  }

  toggleForm(){
    if(this.promenljiva == true){
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
    this.promenljiva = !this.promenljiva;

    if(this.hidePassword == false){
        this.hidePassword = true;
    }
  }
}