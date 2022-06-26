import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
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
  
  //public file:File = undefined!;

  public file:any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/silla.jpg';



  constructor() { }

  ngOnInit(): void {
  }

  registro(registroForm:any){
      if(registroForm.valid){


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
