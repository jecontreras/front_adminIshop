import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { OrdenesService } from 'src/app/servicesComponents/ordenes.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  query:any = { 
    where:{

    },
    page: 0,
    limit: 10
  };
  dataTablet:any = {
    header: ["Opciones", "Codigo", "Cedula Cliente", "Nombre Cliente", "Numero Cliente", "Nombre Vendedor", "Cedula Vendedor", "Numero Vendedor", "Comision", "Precio Total", "Ciudad Cliente"],
    data: [],
    count: 0
  };
  progreses:boolean = false;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  opcionCurrencys:any = {};

  constructor(
    private _facturas: OrdenesService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._facturas.get( this.query ).subscribe(( res:any )=>{
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

}
