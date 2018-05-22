import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';




@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
    localStorage.clear();
    const email = form.value.email;
    const password = form.value.password;
    return  this.authService.signinUser(email, password);

  }



//"NL63ZZZ321096450000"
/*


^NL - The first 2 characters need to be NL//

\d{2} - The next 2 characters need to be numeric

\w{3} - The next 3 characters need to be alfanumeric

\d{8} - The next 8 characters need to be numeric

.* - anything

\d{4}$ - The last 4 characters need to be numeric

/^NL\d{2}\w{3}\d{8}.*\d{4}$/.test("NL63ZZZ321096450000")

*/


}
