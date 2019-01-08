import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService} from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute, private modalService: ModalService) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');        // Cuando se le pone el + a un atributo, automaticamente se convierte en un String
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
          })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal
      });
    });
  }

  delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })

    swalWithBootstrapButtons({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter (cli => cli!== cliente)

            swalWithBootstrapButtons(
              'Cliente eliminado',
              'El cliente se ha elimando con éxito',
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
