import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, throwError } from  'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  // Buscar todos los clientes
  getClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
      map (response => {
        let clientes = response as Cliente [];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          return cliente;
        })
      })
    );
  }
  // Crear nuevo cliente
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status == 400){
            return throwError(e);
        }
        console.log(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );;
  }

  // Buscar cliente por ID
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal('Error al buscar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Acutalizar cliente
  update(cliente: Cliente): Observable <any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status == 400){
            return throwError(e);
        }
        console.log(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );;
  }

  // Borrar cliente
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );;
  }

}
