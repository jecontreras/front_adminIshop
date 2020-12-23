import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {


  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('colores/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('colores',query, 'post');
  }
  update(query:any){
    return this._model.querys('colores/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('colores/'+query.id, query, 'delete');
  }
}