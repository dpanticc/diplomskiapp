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


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class AppComponent implements OnInit{
  
  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginForm!: FormGroup;
  
  title = 'reservationapp';
  hidePassword: boolean = true;

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    console.log("Init");
  }

  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  };

  onSubmit(){
    console.log('1');

    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('2');
          console.log('Logged in successfully!', response);
        }
      )
    }else{

    }
    console.log("3");
  };

}
