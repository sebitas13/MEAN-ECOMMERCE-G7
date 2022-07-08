
import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';


// declare var require: any

// const Workbook = require('exceljs');
// var fs = require('file-saver');


import { Workbook } from 'exceljs';
import * as fs from 'file-saver';


declare var iziToast:any;
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public load_data = true;
  public filtro  = '';
  public token:any;
  public productos : Array<any> = [];
  public arr_productos : Array<any> = [];
  public url:any;

  public page = 1;
  public pageSize = 20;
  public load_btn =false;

  constructor(
    private _productoService : ProductoService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {

    this.init_data();
  }

  
  init_data(){
    this._productoService.listar_productos_admin(this.filtro,this.token).subscribe(
      response=>{
          console.log(response);
          this.productos = response.data;

          this.productos.forEach(element =>{
            this.arr_productos.push({
              titulo : element.titulo,
              stock : element.stock,
              precio : element.precio,
              categoria : element.categoria,
              nventas : element.nventas
            });
          });
          console.log(this.arr_productos);
          
          this.load_data = false;
      },error=>{
          console.log(error);
          
      }
    )
  }

  filtrar(){
    if(this.filtro){

      this._productoService.listar_productos_admin(this.filtro,this.token).subscribe(
        response=>{
            console.log(response);
            this.productos = response.data;
            this.load_data = false;
        },error=>{
            console.log(error);
            
        }
      )


          
    }else{
          iziToast.show({
            title:'ERROR',
            titleColor:'red',
            class:'text-danger',
            position:'topRight',
            message : 'Que esperas para ingresar algo en el filtro ?'
        });
    }
  }

  resetear(){
    this.filtro= '';
    this.init_data();
  }

  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id,this.token).subscribe(
      response=>{
          iziToast.show({
          title:'SUCCESS',
          titleColor:'#1DC74C',
          class:'text-success',
          position:'topRight',
          message : 'Registro producto eliminado'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn = false;
        this.init_data();
                
      },
        error=>{
          iziToast.show({
            title:'SUCCESS',
            titleColor:'#1DC74C',
            class:'text-success',
            position:'topRight',
            message : 'No se pudo eliminar por algun extraño problema en el servidor'
          });
        console.log(error);
        this.load_btn = false;
      }
    )
  }

  download_excel(){
    //*********extraido de EchoSlams**************

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("NOMBRE-LIBRO");

    //CONVIRTIENDO NUESTRO ARREGLO A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
      worksheet.addRow(undefined);
      for (let x1 of this.arr_productos){
          let x2=Object.keys(x1);
    
          let temp=[]
          for(let y of x2){
            temp.push(x1[y])
          }
          worksheet.addRow(temp)
      }
      //NOMBRE DEL ARCHIVO RESULTANTE
      let fname='REP01- ';


      //ASIGNACIÓN DE LA CABECERA DEL DOCUMENTO EXCEL DONDE CADA CAMPO DE LOS DATOS QUE EXPORTAREMOS SERA UNA COLUMNA

      worksheet.columns = [
        { header: 'Producto', key: 'col1', width: 30},
        { header: 'Stock', key: 'col2', width: 15},
        { header: 'Precio', key: 'col3', width: 15},
        { header: 'Categoria', key: 'col4', width: 25},
        { header: 'N° ventas', key: 'col5', width: 15},
      ]as any;

      //PREPACION DEL ARCHIVO Y SU DESCARGA
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fname+'.xlsx');
      });

  }

}
