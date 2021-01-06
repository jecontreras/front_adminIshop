import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { OrdenesService } from 'src/app/servicesComponents/ordenes.service';

@Component({
  selector: 'app-form-ordenes',
  templateUrl: './form-ordenes.component.html',
  styleUrls: ['./form-ordenes.component.scss']
})
export class FormOrdenesComponent implements OnInit {
  
  data:any = {};
  id:string;

  constructor(
    private activate: ActivatedRoute,
    private _facturas: OrdenesService,
    private _Tools: ToolsService
  ) { }

  ngOnInit() {
    this.id = ( this.activate.snapshot.paramMap.get('id') );
    if( this.id ) this.getRow();
  }

  getRow(){
    this._facturas.get( { where: { id: this.id } } ).subscribe(( res:any )=>{
      res = res.data[0];
      if( !res ) return this._Tools.tooast( { title: "Error no encontramos esa factura", icon: "error" } );
      this.data = res;
    },( error:any )=> { this._Tools.tooast( { title: "Error de servidor", icon: "error"} ) } );
  } 

}
