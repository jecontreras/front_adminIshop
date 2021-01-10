import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('marca/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('marca',query, 'post');
  }
  update(query:any){
    return this._model.querys('marca/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('marca/'+query.id, query, 'delete');
  }
}
