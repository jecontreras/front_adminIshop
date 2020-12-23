import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class TipoTallasService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tbltipotalla/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tbltipotalla',query, 'post');
  }
  update(query:any){
    return this._model.querys('tbltipotalla/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tbltipotalla/'+query.id, query, 'delete');
  }
}