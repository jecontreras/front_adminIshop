import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('productos/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('productos',query, 'post');
  }
  update(query:any){
    return this._model.querys('productos/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('productos/'+query.id, query, 'delete');
  }
}
