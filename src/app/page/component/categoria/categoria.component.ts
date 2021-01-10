import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { CategoriaService } from 'src/app/servicesComponents/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  query:any = { 
    where:{

    },
    sort: "estado ASC",
    page: 0,
    limit: 10
  };
  dataTablet:any = {
    header: ["Opciones", "Nombre", "Estado", "Creado"],
    data: [],
    count: 0
  };
  progreses:boolean = false;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  opcionCurrencys:any = {};

  constructor(
    private _categoria: CategoriaService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._categoria.get( this.query ).subscribe(( res:any )=>{
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

   async eliminar( item ){
    let alert:any = this._tools.confirm( { header: "Estas seguro de eliminar" } );
    if( !alert ) return false;
    let data:any = { id: item.id, estado: 1 };
    let result:any = await this.update( data );
    if( !result ) return false;
    this.dataTablet.data = this.dataTablet.data.filter( ( row:any )=> row.id != item.id );
  }

  update( data:any ){
    return new Promise( resolve =>{
      this._categoria.update( data ).subscribe(( res:any )=>{
        this._tools.tooast( { title: "Actualizado" } );
        resolve( res );
       },( error:any )=> { this._tools.tooast( { title: "Error de servidor", icon: "error" } ); resolve( false ); } );
    });
  }

  async EstadoDetalle( item:any ){
    let data:any = { id: item.id, estado: item.estado };
    await this.update( data );
  }

}
