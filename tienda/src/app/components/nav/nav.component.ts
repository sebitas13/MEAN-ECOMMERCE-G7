import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public config_global : any = {};

  constructor(
    private _clienteService : ClienteService,
    private _router : Router,
    
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

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

}
