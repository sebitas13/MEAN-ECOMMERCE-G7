import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;


@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public cupon:any = {tipo:''};
  public load_btn = false;
  public token:any;

  constructor(
    private _cuponService : CuponService,
    private _router:Router
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
  }


  registro(registroForm:any){
    this.load_btn = true;
    if(registroForm.valid){
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{
          
         
              iziToast.show({
                title:'SUCCESS',
                titleColor:'#1DC74C',
                class:'text-success',
                position:'topRight',
                message : 'Registro Exitoso del nuevo Cupon'
            });

            this.load_btn = false;
            this._router.navigate(['/panel/cupones']);
            
        },
        error=>{
          console.log(error);
          
        }
      )

        console.log(this.cupon);
        
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
}

