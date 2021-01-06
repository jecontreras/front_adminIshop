import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('facturas/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('facturas',query, 'post');
  }
  update(query:any){
    return this._model.querys('facturas/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('facturas/'+query.id, query, 'delete');
  }
}
