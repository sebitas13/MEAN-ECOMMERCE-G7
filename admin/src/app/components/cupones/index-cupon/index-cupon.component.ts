import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';
declare var JQuery:any;
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones : Array<any> = [];
  public load_data=true;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token:any;

  constructor(
    private _cuponService : CuponService
  ) { 

    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response =>{
          this.cupones = response.data;
          this.load_data = false;
          
      }
    )
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response =>{
          this.cupones = response.data;
          this.load_data = false;
          
      }
    )
  }

  eliminar(id:any){
    this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
      response=>{
          iziToast.show({
          title:'SUCCESS',
          titleColor:'#1DC74C',
          class:'text-success',
          position:'topRight',
          message : 'Registro cliente eliminado'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
          response =>{
              this.cupones = response.data;
              this.load_data = false;
              
          }
        )
                
      },
        error=>{
        console.log(error);
      }
    )
  }


}
