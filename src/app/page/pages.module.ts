import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages/pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../theme/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HomeComponent } from './component/home/home.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ComponentModule } from '../component/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoComponent } from './component/producto/producto.component';
import { FormproductoComponent } from './form/formproducto/formproducto.component';
import { MarcasComponent } from './component/marcas/marcas.component';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { OrdenesComponent } from './component/ordenes/ordenes.component';
import { NotificacionesComponent } from './component/notificaciones/notificaciones.component';
import { VendedoresComponent } from './component/vendedores/vendedores.component';
import { ClientesComponent } from './component/clientes/clientes.component';

@NgModule({
  declarations: [ 
    HomeComponent,
    PagesComponent,
    ProductoComponent,
    FormproductoComponent,
    MarcasComponent,
    CategoriaComponent,
    OrdenesComponent,
    NotificacionesComponent,
    VendedoresComponent,
    ClientesComponent
  ],
  imports: [
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    AngularEditorModule,
    NgxCurrencyModule,
    NgxDropzoneModule,
    AutocompleteLibModule
  ],
  bootstrap: [ PagesComponent ]
})
export class PagesModule { }
