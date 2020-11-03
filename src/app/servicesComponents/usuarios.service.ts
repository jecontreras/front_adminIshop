import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

declare const window:any;
declare const FB:any;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('personas/querys',query, 'post');
  }

  cambiarContrasena(query:any){
    return this._model.querys('personas/resetiar',query, 'post');
  }

  getInfo(query:any){
    return this._model.querys('personas/infoUser',query, 'post');
  }

  darPuntos(query:any){
    return this._model.querys('personas/guardarPunto',query, 'post');
  }
  
  getNivel(query:any){
    return this._model.querys('personas/nivelUser',query, 'post');
  }

  cambioPass(query:any){
    return this._model.querys('personas/cambioPass',query, 'post');
  }

  login(query:any){
    return this._model.querys('personas/login',query, 'post');
  }

  create(query:any){
    return this._model.querys('personas/register',query, 'post');
  }

  update(query:any){
    return this._model.querys('personas/'+query.id, query, 'put');
  }
  
  delete(query:any){
    return this._model.querys('personas/'+query.id, query, 'delete');
  }
  procesoFacebook(){
    FB.getLoginStatus(function(response) {
      console.log( response );
      if( !response ) this.loginFacebook();
      if( response.status != "connected" ) this.loginFacebook();
      //this.checkLoginState();
    });
  }

  checkLoginState() {
    FB.getLoginStatus(function(response) {
      console.log( response );
    });
  }

  loginFacebook(){
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '821007851765715',
        cookie     : true,
        xfbml      : true,
        version    : 'v7.0'
      });
        
      FB.AppEvents.logPageView();   
        
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }
}
