import { Component, OnInit } from '@angular/core';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductosService } from 'src/app/servicesComponents/productos.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.scss']
})
export class FormproductoComponent implements OnInit {

  files: File[] = [];
  list_files: any = [];

  data:any = {};
  id:any;
  listGaleria:any = [];
  opcionCurrencys:any = {};
  listSubCategorias:any = [];
  listMarca:any = [];
  listGenero:any = [];
  disableEliminar:boolean = false;
  disable:boolean = false;

  constructor(
    private _archivos: ArchivosService,
    private _tools: ToolsService,
    private _productos: ProductosService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
  }

  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  onSelects(event: any) {
    //console.log(event, this.files);
    this.files.push(...event.addedFiles)
  }


  onRemoves(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  subirFile(item:any){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    //this._archivos.create( this.files[0] );
    this._archivos.create( form ).subscribe((res:any)=>{
      // console.log(res);
      if( item == false ){
        this.data.foto = res.files;//URL+`/${res}`;
        if( this.id ) this.submit();
      }
      else item.foto = res.files;
      this._tools.presentToast("Exitoso");
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  async subirVarios(){
    for( let row of this.files ){
      await this.fileSubmit( row );
    }
  }

  fileSubmit( row:any ) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', row);
      this._tools.ProcessTime({});
      //this._archivos.create( this.files[0] );
      this._archivos.create(form).subscribe(async (res: any) => {
        //console.log(res);
        let titulo:string = this.data.titulo || this._tools.codigo();
        let data = {
          "titulo": titulo,
          "slug": _.kebabCase( titulo ),
          "idSubCategoria": 1,
          "idEmpresa": 1,
          "cantidad": 99,
          "precioVenta": this.data.precioVenta,
          "precioCompra": this.data.precioCompra,
          "precioOferta": this.data.precioOferta,
          "comision": this.data.comision,
          "subasta": false,
          "idPeso": 1,
          "marca": 1,
          "genero": 1,
          "image": res.files,
          "detalle": `disponibles desde la talla 36 a la talla 43 echos en material sintético de muy buena calidad`,
          "product_code": this._tools.codigo()
        };
        let result:any = await this.guardar( data );
        if( !result ) resolve( false );
        this.data.id = result.id;
        this.id = result.id;
        this.listGaleria.push( this.data );
        resolve(true);
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); });
    });
  }

  verPublicacion( item ){
    this.id = item.id;
    this.data = item;
  }

  async submit(){
    this.disable = true;
    if( this.id ) await this.update( this.data );
    else await this.guardar( this.data );
    this.disable = false;
  }

  async guardar( data:any ){
    return new Promise( resolve =>{
      this._productos.create( data ).subscribe(( res:any )=>{
        this._tools.tooast( { title: 'Guardado exitos' });
        resolve( res );
      },( error )=> { this._tools.tooast( { title: 'Error', icon: 'error' }); resolve( false ) });
    });
  }

  async update( data:any ){
    let datas = _.omitBy( data, _.isNull);
    datas =  _.omit(data, [ 'idEmpresa', 'image_galery']);
    return new Promise( resolve =>{
      this._productos.update( datas ).subscribe(( res:any )=>{
        this._tools.tooast( { title: 'Actualizado exitos' });
        resolve( res );
      },( error )=> { this._tools.tooast( { title: 'Error', icon: 'error' }); resolve( false ) });
    });
  }

  eliminarSeleccion( item:any ){
    let data:any = { id: item.id };
    this.disableEliminar = true;
    this._productos.delete( data ).subscribe((res:any)=>{
      this.disableEliminar = false;
      this.listGaleria = this.listGaleria.filter((row:any) => row.id !== item.id );
      this.data = {
        product_code: this._tools.codigo()
      };
      this._tools.presentToast("Eliminado Exitos");
    },(error:any)=> { this._tools.presentToast("Error de servidor"); this.disableEliminar = false; })
  }


}
