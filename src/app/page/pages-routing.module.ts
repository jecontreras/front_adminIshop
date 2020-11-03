import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/page/component/home/home.component';
import { ProductoComponent } from './component/producto/producto.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
