import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductosService } from 'src/app/servicesComponents/productos.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  
  public listRow: any = [];
  public count: number = 0;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;

  query:any = {};
  progreses:boolean = false;
  
  constructor(
    private _producto: ProductosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._producto.get( this.query ).subscribe((res:any)=> this.procesoGet( res ), (error)=> { this.progreses = false; this._tools.tooast( { title: "Error de servidor", icon: "error" } )} );
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
   }

  procesoGet( res:any ){
    console.log( res );
    this.progreses = false;
    this.listRow = _.unionBy(this.listRow || [], res.data, 'id');
    this.count = res.count;
        
    if (res.data.length === 0 ) {
      this.notEmptyPost =  false;
    }
    this.notscrolly = true;
  }

}
