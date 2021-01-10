import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss']
})
export class VendedoresComponent implements OnInit {

  query:any = { 
    where:{

    },
    page: 0,
    limit: 10
  };
  dataTablet:any = {
    header: ["Opciones", "Foto", "Nombre", "Apellido", "Username", "Email", "Celular", "Cedula", "Contraseña", "Creado"],
    data: [],
    count: 0
  };
  progreses:boolean = false;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  opcionCurrencys:any = {};

  constructor(
    private _vendedores: UsuariosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._vendedores.get( this.query ).subscribe(( res:any )=>{
      this.procesoGet( res );
    },( error:any )=> { this._tools.tooast( { title: "Error de servidor", icon: "error" } ); } );
  }

  procesoGet( res:any ){
    console.log( res );
    this.progreses = false;
    this.dataTablet.data = _.unionBy( this.dataTablet.data || [], res.data, 'id' );
    this.dataTablet.count = res.count;
    console.log( this.dataTablet )
        
    if ( res.data.length === 0 ) this.notEmptyPost =  false;
    this.notscrolly = true;
  }

  onScroll(){
    if ( this.notscrolly && this.notEmptyPost ) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
   }

   actualizarPass(item){
     this._vendedores.cambiarPass( { id: item.id, password: item.password }).subscribe(( res:any )=>{
       this._tools.tooast( { title: "Actualizado contraseña" } );
     },( error:any )=> { this._tools.tooast( { title:"Error con el cambio de contraseña", icon: "error"} ); });
   }

}
