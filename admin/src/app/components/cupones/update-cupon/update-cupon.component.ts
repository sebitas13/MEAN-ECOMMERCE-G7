import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  public cupon:any = {tipo:''};
  public load_btn = false;
  public token:any;
  public id:any;

  constructor(
    private _cuponService : CuponService,
    private _router:Router,
    private _route : ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
          this.id = params['id'];
          console.log(this.id);
          
         this._cuponService.obtener_cupon_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.cupon = undefined;
            }else{
              this.cupon = response.data;
            }
            console.log(this.cupon);
            

          }
         )
          
      }
    )
  }

  actualizar(actualizarForm:any){

  }

}
