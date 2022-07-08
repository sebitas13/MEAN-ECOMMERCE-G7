import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast:any;
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id:any;
  public token:any;
  public _iduser:any;
  public producto:any = {};
  public inventarios :Array<any> = [];
  public arr_inventario : Array<any> = [];
  public load_btn =false;
  public inventario : any = {};

  constructor(
    private _route : ActivatedRoute,
    private _productoService : ProductoService,
  ) { 
    this.token=localStorage.getItem('token');
    this._iduser= localStorage.getItem('_id');
    console.log(this._iduser);
    
  }

  ngOnInit(): void {

    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
  
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
              console.log(response);
              if(response.data == undefined){
                  this.producto = undefined;
              }else{
                this.producto = response.data;
              

                this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
                  response=>{
                    
                    this.inventarios = response.data;
                    this.inventarios.forEach(element=>{
                      this.arr_inventario.push({
                        admin : element.admin.nombres + ' ' + element.admin.apellidos,
                        cantidad : element.cantidad,
                        proveedor : element.proveedor
                      });
                    });
                    
                  },error=>{
                   // console.log(error);
                  }
                );
              }
              
          },error=>{
             // console.log(error);
              
          }
        )
      }
    );
  }

  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_inventario_producto_admin(id,this.token).subscribe(
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
        
        this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
          response=>{
            
            this.inventarios = response.data;
            console.log(this.inventarios);
            
          },error=>{
            console.log(error);
          }
        );
                
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

  registro_inventario(inventarioFormm: any){
    if(inventarioFormm.valid){
        let data = {
          producto : this.producto._id,
          cantidad : inventarioFormm.value.cantidad,
          admin : this._iduser,
          proveedor : inventarioFormm.value.proveedor
        }
        console.log(data);
        
        this._productoService.registro_inventario_producto_admin(data,this.token).subscribe(
          response=>{
            iziToast.show({
              title:'SUCCESS',
              titleColor:'#1DC74C',
              class:'text-success',
              position:'topRight',
              message : 'Se agrego el nuevo stock'
            });

            this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
              response=>{
                
                this.inventarios = response.data;
          
                
              },error=>{
               // console.log(error);
              }
            );
            
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
        message : 'Datos no validos del formulario'
    });

    }
  }

  download_excel(){
    //*********extraido de EchoSlams**************

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("NOMBRE-LIBRO");

    //CONVIRTIENDO NUESTRO ARREGLO A UN FORMATO LEGIBLE PARA EXCEL USANDO EXCELJS
      worksheet.addRow(undefined);
      for (let x1 of this.arr_inventario){
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
        { header: 'Trabajador', key: 'col1', width: 30},
        { header: 'Cantidad', key: 'col2', width: 15},
        { header: 'Proveedor', key: 'col3', width: 25},
      
      ]as any;

      //PREPACION DEL ARCHIVO Y SU DESCARGA
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fname+'.xlsx');
      });

  }

}

