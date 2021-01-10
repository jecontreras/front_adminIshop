import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('categoria/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('categoria',query, 'post');
  }
  update(query:any){
    return this._model.querys('categoria/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('categoria/'+query.id, query, 'delete');
  }
}
