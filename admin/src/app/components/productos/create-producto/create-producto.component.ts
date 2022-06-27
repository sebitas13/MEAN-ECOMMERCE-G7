import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import {  Router } from '@angular/router';
declare var iziToast:any;
declare var JQuery:any;
declare var $:any;

//let file :any = undefined;




@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})


export class CreateProductoComponent implements OnInit {

  public producto : any = {};
  public load_btn = false;
  
  //public file:File = undefined!;

  public file:any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/silla.jpg';
  public config : any = {};
  public token:any;


  constructor(
    private _productoService : ProductoService,
    private _adminService : AdminService,
    private _router:Router
    ) {
    
    this.config = {
      height :500
    }
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
  }

  registro(registroForm:any){
      if(registroForm.valid){
          if(this.file == undefined){

                  iziToast.show({
                  title:'ERROR',
                  titleColor:'red',
                  class:'text-danger',
                  position:'topRight',
                  message : 'falta subir la portada padre'
              });

          }else{
            console.log(this.producto);
            console.log(this.file);
            this.load_btn = true;
            this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
                  response=>{
                    iziToast.show({
                      title:'SUCCESS',
                      titleColor:'#1DC74C',
                      class:'text-success',
                      position:'topRight',
                      message : 'Registro Exitoso del nuevo producto'
                  });
                  this.load_btn = false;
                  this._router.navigate(['/panel/productos']);
              },error=>{
                  this.load_btn = false;
                  console.log(error);
                  
              }
            );
            
          }

      }else{
            iziToast.show({
              title:'ERROR',
              titleColor:'red',
              class:'text-danger',
              position:'topRight',
              message : 'Datos no validos del formulario'
          });

        this.load_btn = false;
      }
  }

  fileChangeEvent(event:any):void{
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
          
          
          reader.readAsDataURL(file);
          $('#input-portada').text(file.name);
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

}
