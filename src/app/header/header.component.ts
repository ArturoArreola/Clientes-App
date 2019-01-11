import {Component} from '@angular/core';
import {AuthService} from '../usuarios/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{
  title:string = 'App-Angular-Spring'

  constructor(private authService:AuthService, private router:Router){}

  logout():void{
    this.authService.logout();
    swal('Sesión terminada','','success');
    this.router.navigate(['/login']);  
  }
}
