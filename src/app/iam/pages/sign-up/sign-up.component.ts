import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {SignUpRequest} from "../../model/sign-up.request";
import {AuthenticationService} from "../../services/authentication.service";
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatCardTitle,
    MatError,
    NgIf, MatSlideToggle, MatRadioGroup, MatRadioButton],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent extends BaseFormComponent implements OnInit{
  form!: FormGroup;
  submitted = false;
  role:string='';


  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    let username = this.form.value.username;
    let password = this.form.value.password;
    let roles = [];
    roles.push(this.form.value.role);
    const signUpRequest = new SignUpRequest(username,password,roles);
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }
}
