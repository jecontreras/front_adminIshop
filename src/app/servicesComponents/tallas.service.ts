import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class TallasService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tallas/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tallas',query, 'post');
  }
  update(query:any){
    return this._model.querys('tallas/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tallas/'+query.id, query, 'delete');
  }
}