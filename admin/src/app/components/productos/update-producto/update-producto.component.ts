import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import {  Router } from '@angular/router';

declare var iziToast:any;
declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto: any = {};
  public config : any = {};
  public imgSelect : any | String | ArrayBuffer;
  public load_btn = false;
  public id:any;
  public token:any;
  public url:any;
  public file:any = undefined;
 

  constructor(
    private _route : ActivatedRoute,
    private _productoService : ProductoService,
    private _router:Router
  ) { 
    this.config = {
      height :500
    }
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
              console.log(response);
              if(response.data == undefined){
                  this.producto = undefined;
              }else{
                this.producto = response.data;
                this.imgSelect = this.url+'obtener_portada/'+ this.producto.portada;
              }
              
          },error=>{
              console.log(error);
              
          }
        )
      }
    );
  }

  actualizar(actualizarForm:any){

    if(actualizarForm.valid){

        console.log(this.producto);
        console.log(this.file);

        var data:any = {};
        if(this.file != undefined){
          data.portada = this.file;
        }

        data.titulo = this.producto.titulo;
        data.stock = this.producto.stock;
        data.precio = this.producto.precio;
        data.categoria = this.producto.categoria;
        data.descripcion = this.producto.descripcion;
        data.contenido = this.producto.contenido;

        this.load_btn = true;
        this._productoService.actualizar_producto_admin(data,this.id,this.token).subscribe(
              response =>{
                iziToast.show({
                  title:'SUCCESS',
                  titleColor:'#1DC74C',
                  class:'text-success',
                  position:'topRight',
                  message : 'Actualizacion Exitosa del producto'
              });

              this.load_btn = false;
              this._router.navigate(['/panel/productos']);
          },error =>{
              console.log(error);
              this.load_btn = false;
          }
        );
        
      
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
