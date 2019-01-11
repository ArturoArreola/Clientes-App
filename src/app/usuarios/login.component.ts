import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Inicio de sesión';
  usuario:Usuario;

  constructor(private authService:AuthService, private router:Router) {
    this.usuario= new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      swal('Login', `Ya estás autenticado ${this.authService.usuario.username}`, 'info');
      this.router.navigate(['./clientes']);
    }
  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal('Error', 'Por favor ingresa tu username y tu password', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(
      response =>{
        console.log(response);
        console.log("PAYLOAD ->" + response.access_token.split(".")[1]) ;

        let usuario = this.authService.usuario;

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        this.router.navigate(['./clientes']);
        swal('Bienvenido',`Has iniciado sesión con éxito ${usuario.username}`, 'success');
    }, err => {
      if(err.status == 400){
        swal('Oops', 'Username o contraseña incorrectas', 'error');
      }
    });
  }
}
