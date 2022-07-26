import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var $;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token:any;
  public id :any;
  public user:any = undefined;
  public user_local : any = {};
  public op_cart = false;
 // public item :any; //agregado sebas
  public config_global : any = {};
  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;

  constructor(
    private _clienteService : ClienteService,
    private _router : Router,
    
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;
    this._clienteService.obtener_config_publico().subscribe(
      response=>{
        
        this.config_global = response.data; //aca estaran todas las categorias, en el global
        //console.log(this.config_global);
        
      }
    )

    

    //console.log(this.user_local);
    
    if(this.token){

      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
          
          this.user = response.data;
          localStorage.setItem('user_data',JSON.stringify(this.user));
          
          if(localStorage.getItem('user_data')){
           // this.item = localStorage.getItem('user_data');
            this.user_local = JSON.parse(localStorage.getItem('user_data')!);

            this._clienteService.obtener_carrito_cliente(this.user_local._id,this.token).subscribe(
              response=>{
                this.carrito_arr = response.data;
                this.calcular_carrito();
              }
            )
          }else{
            this.user_local=undefined;
          }
        },
        error=>{
          console.log(error);
          this.user = undefined;
        }
      )
    }else{
      this.user_local=undefined;
    }
    
   }

  ngOnInit(): void {
  }

  logout(){
    window.location.reload(); //refrescad de paginang 
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show');
    }else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element=>   {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })
  }

}
