import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('clientes/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('clientes',query, 'post');
  }
  update(query:any){
    return this._model.querys('clientes/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('clientes/'+query.id, query, 'delete');
  }
}
