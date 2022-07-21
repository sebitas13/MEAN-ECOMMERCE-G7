import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

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
 // public item :any; //agregado sebas

  constructor(
    private _clienteService : ClienteService
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    

    console.log(this.user_local);
    
    if(this.token){

      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
          
          this.user = response.data;
          localStorage.setItem('user_data',JSON.stringify(this.user));
          
          if(localStorage.getItem('user_data')){
           // this.item = localStorage.getItem('user_data');
            this.user_local = JSON.parse(localStorage.getItem('user_data')!);
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

}
