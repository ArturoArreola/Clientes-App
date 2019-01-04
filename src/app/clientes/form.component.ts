import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
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

  constructor(private clienteService:ClienteService,
  private router:Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente = cliente)
      }
    })
  }

  create():void{
    console.log("Llegando al componente");
    console.log(this.cliente);
    this.clienteService.create(this.cliente)
    .subscribe( cliente =>{
      this.router.navigate(['/clientes'])
      swal('Guardado',`Se ha guardado a ${cliente.nombre} ${cliente.apellido} con éxito`, 'success')
    }
    );
  }

  update():void{
    this.clienteService.update(this.cliente).subscribe(
      cliente =>{
        this.router.navigate(['/clientes'])
        swal('Éxito',`Se ha actualizado a ${cliente.nombre} ${cliente.apellido} con éxito`, 'success')
      }

    )
  }

}
