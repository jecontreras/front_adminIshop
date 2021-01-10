import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { MarcaService } from 'src/app/servicesComponents/marca.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit {

  query:any = { 
    where:{

    },
    page: 0,
    limit: 10
  };
  dataTablet:any = {
    header: ["Opciones","Nombre","Estado","Creado"],
    data: [],
    count: 0
  };
  progreses:boolean = false;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  opcionCurrencys:any = {};

  constructor(
    private _marcas: MarcaService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._marcas.get( this.query ).subscribe(( res:any )=>{
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

   eliminar( item ){
    let alert:any = this._tools.confirm( { header: "Estas seguro de eliminar" } );
    if( !alert ) return false;
    this._marcas.update( { id: item.id, estado: 1 } ).subscribe(( res:any )=>{
     this._tools.tooast( { title: "Actualizado" } );
     this.dataTablet.data = this.dataTablet.data.filter( ( row:any )=> row.id != item.id );
    },( error:any )=> { this._tools.tooast( { title: "Error de servidor", icon: "error" } ) } );
  }


}
