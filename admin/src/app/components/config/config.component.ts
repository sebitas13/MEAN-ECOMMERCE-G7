import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

import { v4 as uuidv4 } from 'uuid';

declare var iziToast:any;
declare var JQuery:any;
declare var $:any;


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token:any;
  public config:any = {};
  public url:any;

  public titulo_cat = '';
  public icono_cat = '';
  //public file: File = undefined!;
  public file:any = undefined;
  public imgSelect : any | String | ArrayBuffer;
  

  constructor(private _adminService : AdminService) { 

    this.token = localStorage.getItem('token');
    this.url=GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      response=>{
        this.config = response.data;
        this.imgSelect = this.url+'obtener_logo/'+this.config.logo;
      },
      error=>{
        console.log(error);
        
      }
    )
  }

  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.icono_cat && this.titulo_cat){
      console.log(uuidv4());
      

        this.config.categorias.push({
          titulo: this.titulo_cat,
          icono: this.icono_cat,
          _id : uuidv4() //por cada registro me creara un id unico
        });

        this.titulo_cat='';
        this.icono_cat='';
    }else{
      iziToast.show({
        title:'ERROR',
        titleColor:'red',
        class:'text-danger',
        position:'topRight',
        message : 'Te falta ingresar la categoria e icono'
    });
    }
  }

  actualizar(confForm:any){
      if(confForm.valid){

        let data = {
          titulo : confForm.value.titulo,
          serie : confForm.value.serie,
          correlativo : confForm.value.correlativo,
          categorias : this.config.categorias,
          logo : this.file
        }

        console.log(data);
        
        this._adminService.actualiza_config_admin("62c31e61c6af86d0c416a4a9",data,this.token).subscribe(
          response=>{
            iziToast.show({
              title:'SUCCESS',
              titleColor:'#1DC74C',
              class:'text-success',
              position:'topRight',
              message : 'Se actualizo la configuracion'
          });
            
          }
        )
      }else{
        iziToast.show({
          title:'ERROR',
          titleColor:'red',
          class:'text-danger',
          position:'topRight',
          message : 'Complete correctamente el formulario'
      });
      }
  }

  fileChangeEvent(event:any) : void{
    //var file;
    let file :any = undefined;


    if(event.target.files && event.target.files[0]){
        file = <File>event.target.files[0];
       
        
    }else{
      iziToast.show({
        title:'ERROR',
        titleColor:'red',
        class:'text-danger',
        position:'topRight',
        message : 'No hay una imagen de envio'
    });
    }

    if(file?.size <= 4000000){
      //sdsdf

      if(file.type == 'image/png' || file.type =='image/jpg' ||file.type == 'image/gif' ||  file.type =='image/webp' || file.type =='image/jpeg'){
        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        
        $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
        $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
        reader.readAsDataURL(file);
       // $('#input-portada').text(file.name);
        this.file = file;

      }else{
            iziToast.show({
              title:'ERROR',
              titleColor:'red',
              class:'text-danger',
              position:'topRight',
              message : 'El archivo debe ser una imagen valida'
          });
          this.imgSelect = 'assets/img/silla.jpg';
        this.file = undefined;
      }
    }else{
          iziToast.show({
            title:'ERROR',
            titleColor:'red',
            class:'text-danger',
            position:'topRight',
            message : 'La imagen no puede superar los 4MB'
        });

        this.imgSelect = 'assets/img/silla.jpg';
        this.file = undefined;

    }

    console.log(this.file);
  }

  ngDoCheck(): void {
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  eliminar_categorias(idx:any){
      this.config.categorias.splice(idx,1);
  }

}
