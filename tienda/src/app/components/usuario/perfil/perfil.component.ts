import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast:any;


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente : any = {};
  public id:any;
  public token:any;

  constructor(
    private _clienteService : ClienteService
  ) { 
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if(this.id){
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
          
          this.cliente = response.data;
          
        },error=>{
          console.log(error);
          
        }
      )
    }
  }

  ngOnInit(): void {
  }

  actualizar(actualizarForm:any){
      if(actualizarForm.valid){
       this._clienteService.actualizar_perfil_cliente_guest(this.id,this.cliente,this.token).subscribe(
        response=>{
          iziToast.show({
            title:'SUCCESS',
            titleColor:'#1DC74C',
            class:'text-success',
            position:'topRight',
            message : 'Acualizacion exitosa'
        });
          
        }
       )
          
      }else{
        iziToast.show({
          title:'ERROR',
          titleColor:'red',
          class:'text-danger',
          position:'topRight',
          message : 'Datos no validos del formulario'
      });
      }
  }

}
