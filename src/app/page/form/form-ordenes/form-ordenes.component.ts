import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { OrdenesService } from 'src/app/servicesComponents/ordenes.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-ordenes',
  templateUrl: './form-ordenes.component.html',
  styleUrls: ['./form-ordenes.component.scss']
})
export class FormOrdenesComponent implements OnInit {
  
  data:any = {
    idCliente: {},
    idVendedor: {}
  };
  id:string;
  progreses:boolean = true;
  listRow:any = [];
  opcionCurrencys:any = {};

  constructor(
    private activate: ActivatedRoute,
    private _facturas: OrdenesService,
    private _Tools: ToolsService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._Tools.currency;
    this.id = ( this.activate.snapshot.paramMap.get('id') );
    if( this.id ) this.getRow();
  }

  getRow(){
    this._facturas.get( { where: { id: this.id } } ).subscribe(( res:any )=>{
      this.progreses = false;
      res = res.data[0];
      if( !res ) return this._Tools.tooast( { title: "Error no encontramos esa factura", icon: "error" } );
      this.data = res;
      this.listRow = _.map( this.data.productos, ( item:any )=>{
        return {
          ...item,
          ids: item.producto.id,
          foto: item.producto.image,
          titulo: item.producto.titulo,
          createdAt: item.producto.createdAt
        };
      });
    },( error:any )=> { this._Tools.tooast( { title: "Error de servidor", icon: "error"} ); this.progreses = false; } );
  } 

  async EstadoDetalle(){
    let data:any = {
      id: this.data.id,
      estado: Number( this.data.estado )
    };
    let result:any = await this.update( data );
    if( !result ) return this._Tools.tooast( { title: "Error en la actualizacion", icon: "error" } );
    this._Tools.tooast( { title: "Actualizado exitos" } );
  }

  async actualizar(){
    let datas = _.omitBy( this.data, _.isNull);
    datas =  _.omit( this.data, [ 'idCliente', 'idVendedor', 'productos','updatedAt','createdAt']);
    let result = await this.update( datas );
    if( !result ) return this._Tools.tooast( { title: "Error en la actualizacion", icon: "error" } );
    this._Tools.tooast( { title: "Actualizado exitos" } );
  }

  update( data:any ){
    return new Promise( resolve =>{
      this._facturas.update( data ).subscribe(( res:any )=>{
        resolve( res );
      },( error:any )=> resolve( false ) );
    })
  }

}
