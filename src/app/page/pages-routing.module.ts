import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/page/component/home/home.component';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { ClientesComponent } from './component/clientes/clientes.component';
import { MarcasComponent } from './component/marcas/marcas.component';
import { NotificacionesComponent } from './component/notificaciones/notificaciones.component';
import { OrdenesComponent } from './component/ordenes/ordenes.component';
import { ProductoComponent } from './component/producto/producto.component';
import { VendedoresComponent } from './component/vendedores/vendedores.component';
import { FormproductoComponent } from './form/formproducto/formproducto.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: 'producto',
    component: ProductoComponent
  },
  {
    path: 'fromProducto',
    component: FormproductoComponent
  },
  {
    path: 'fromProducto/:id',
    component: FormproductoComponent
  },
  {
    path: 'vendedores',
    component: VendedoresComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'ordenes',
    component: OrdenesComponent
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent
  },
  {
    path: 'marcas',
    component: MarcasComponent
  },
  {
    path: 'categoria',
    component: CategoriaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
