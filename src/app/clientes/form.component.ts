import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente:Cliente = new Cliente();
  private titulo:string= "Crear cliente";
  private errores:string[];
  regiones: Region [];

  constructor(private clienteService:ClienteService,
  private router:Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe((regiones) => this.regiones = regiones);
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente = cliente)
      }
    });

  }

  create():void{
    console.log("Llegando al componente");
    console.log(this.cliente);
    this.clienteService.create(this.cliente)
    .subscribe(cliente =>{
      this.router.navigate(['/clientes'])
      swal('Guardado',`Se ha guardado a ${this.cliente.nombre} ${this.cliente.apellido} con éxito`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Código de error: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(json =>{
        this.router.navigate(['/clientes'])
        swal('Éxito',`Se ha actualizado a ${this.cliente.nombre} ${this.cliente.apellido} con éxito`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código de error: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(region1: Region, region2: Region):boolean{
    if(region1 === undefined && region2 === undefined){
      return true;
    }
    return region1 === null || region2 === null || region1 === undefined || region2 === undefined? false: region1.id === region2.id;
  }
}
