import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { response } from 'express';

declare var iziToast;
declare var Cleave;
declare var StickySidebar;

declare var paypal;


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef | any;
  public idcliente;
  public token;
  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;
  public total_pagar :any = 0;
  public socket = io('http://localhost:4201');
  public direccion_principal : any = {};
  public envios : Array<any> = [];
  public precio_envio = "0";
 

  constructor(
    private _clienteService : ClienteService,
    private _guestService : GuestService
  ) { 
    this.idcliente = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      
      }
    );

    this._guestService.get_Envios().subscribe(
      response=>{
        this.envios = response;
        
      }
    )
   }

  ngOnInit(): void {

    setTimeout(()=>{
              new Cleave('#cc-number', {
                creditCard: true,
                onCreditCardTypeChanged: function (type) {
                    // update UI ...
                }
            });

            new Cleave('#cc-exp-date', {
              date: true,
              datePattern: ['m', 'y']
            });

         
            new StickySidebar('.sidebar-sticky', {topSpacing: 20});


    });


    this.get_direccion_principal();

    //********* CODIGO PARA PAYPAl */

    paypal.Buttons({
      style: {
          layout: 'horizontal'
      },
      createOrder: (data,actions)=>{
  
          return actions.order.create({
            purchase_units : [{
              description : 'Nombre del pago',
              amount : {
                currency_code : 'USD',
                value: 999
              },
            }]
          });
        
      },
      onApprove : async (data,actions)=>{
        const order = await actions.order.capture();
  
        
      },
      onError : err =>{
       
      },
      onCancel: function (data, actions) {
        
      }
    }).render(this.paypalElement.nativeElement);
  }


  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{

        if(response.data == undefined){
          this.direccion_principal = undefined;
        }else{
          this.direccion_principal = response.data;
        }
        
        
      }
    );
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element=>   {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })

    this.total_pagar = this.subtotal;
    
  }

  eliminar_item(id){
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response=>{
        console.log(response);
                  iziToast.show({
                    title:'SUCCESS',
                    titleColor:'#1DC74C',
                    class:'text-success',
                    position:'topRight',
                    message : 'produto retirado del checkout:)'
                });
        this.socket.emit('delete-carrito',{data:response.data});
        
        this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
          response=>{
            this.carrito_arr = response.data;
            this.calcular_carrito();
          }
        )
        
      }
    )
  }

  calcular_total(){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
  }

}
