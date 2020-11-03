import {Injectable} from '@angular/core';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navegacion',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'productos',
        title: 'Productos',
        type: 'item',
        disabled: false,
        url: '/dashboard/producto',
        icon: 'feather icon-home'
      },
      {
        id: 'productosCrear',
        title: 'Productos Crear',
        type: 'item',
        disabled: false,
        url: '/dashboard/fromProducto',
        icon: 'feather icon-home'
      },
      {
        id: 'perfil',
        title: 'Editar Perfil',
        type: 'item',
        disabled: false,
        url: '/dashboard/perfil',
        icon: 'feather icon-home'
      },
    ]
  }
];
@Injectable()
export class NavigationItem {
  dataUser:any = {};
  rolName:string = "";
  constructor(
    private _store: Store<STORAGES>
  ){
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      if( Object.keys( this.dataUser ).length > 0 ) this.rolName = this.dataUser.rol.nombre;
    });
  }
  public get() {
    let filtrados = [];
    // console.log( this.rolName );
    for(let row of NavigationItems){
      for( let item of row.children ){
        if( item.disabled ) { 
          if( this.rolName == 'admin') filtrados.push( item ); 
        }
        else filtrados.push( item );
      }
    }
    return filtrados;
  }
}
