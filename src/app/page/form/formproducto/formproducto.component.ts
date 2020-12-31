import { Component, OnInit } from '@angular/core';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ProductosService } from 'src/app/servicesComponents/productos.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoTallasService } from 'src/app/servicesComponents/tipo-tallas.service';
import { TallasService } from 'src/app/servicesComponents/tallas.service';
import { ColoresService } from 'src/app/servicesComponents/colores.service';

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
  progress:boolean = true;
  listTallas:any = [];
  listColores:any = [];
  listTipoTallas:any = [];
  file: any = {
    foto1: []
  };
  btnDisabled:boolean = false;

  constructor(
    private _archivos: ArchivosService,
    private _tools: ToolsService,
    private _productos: ProductosService,
    private activate: ActivatedRoute,
    private Router: Router,
    private _TipoTalla: TipoTallasService,
    private _Talla: TallasService,
    private _archivo: ArchivosService
  ) { }

  ngOnInit() {
    this.opcionCurrencys = this._tools.currency;
    this.id = this.activate.snapshot.paramMap.get('id');
    if( this.id ) this.getProductos();
    else { this.progress = false; }
    this.getTipoTalla();
  }

  getProductos(){
    this._productos.get( { where: { id: this.id }, limit: 1 } ).subscribe( ( res:any ) => {
      res = res.data[0];
      if( !res ) return this.Router.navigate( [ '/dashboard/producto' ] );
      this.data = res;
      this.data.estado = this.data.estado == 0 ? true : false;
      this.listGaleria.push(
        {
          id: 1,
          image: "https://i.postimg.cc/jj6jRTVr/FOTO2.jpg",
          dataMax: this.data
        }
      );
      this.progress = false;
      this.listTallas = this.data.tallas || [];
      this.listColores = this.data.colores || [];
      this.seleccionTalla();
    },( error:any )=> { this.progress = false; this.Router.navigate( [ '/dashboard/producto' ] ); });
  }

  getTipoTalla(){
    this._TipoTalla.get( { where: { tit_sw_activo: 0 } } ).subscribe(( res:any )=>{
      this.listTipoTallas = res.data;
    },( error:any )=> this._tools.tooast( { title: "Error de servidor", icon: "error"} ) );
  }

  getTallas( tipo:number ){
    this._Talla.get( { where:{ estado:0, tal_tipo: tipo }, limit: 1000 } ).subscribe( ( res:any )=>{
      this.listTallas = res.data;
      for( let row of this.listTallas ) {
        let filtro:any = this.data.tallas.find(( item:any )=> Number( item.nombre )== row.nombre );
        if( filtro ) row.check = true;
        if( !this.id ) row.check = true;
      }
      this.data.tallas = this.listTallas;
      this.data.tallas = _.orderBy( this.data.tallas , ['nombre'], ['asc'] );
      this.listTallas = this.data.tallas;
      // console.log( this.data.tallas );
    },( error:any )=> this._tools.tooast( { title: "Error de servidor", icon: "error"} ) );
  }

  seleccionTalla(){
    this.getTallas( this.data.tipoTalla );
  }

  activarTalla( talla ){
    talla.check = !talla.check;
    this.data.tallas = this.listTallas.filter( ( item:any )=> item.check == true );
    if( !this.id ) return false;
    this.submit();
  }

  async datafiles( ev: any, item:any ) {
    //console.log( ev, this.file );
    this.file.foto1 = [];
    try {
      this.file.foto1 = ev.target.files;
      if (this.file.foto1[0]) {
        item.foto = await this._archivo.getBase64(this.file.foto1[0]);
        this.procesoSubidaImagen( this.file.foto1[0], item );
      }
    } catch (error) { }
  }

  procesoSubidaImagen( file: any, item:any ) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({});
      this._archivo.create(form).subscribe((res: any) => {
        //console.log(form);
        this._tools.tooast({ title: "subido exitoso" });
        item.foto = res.files;
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  agregarColorNew(){
    this.listColores.push({
      codigo: this._tools.codigo()
    });
  }

  agregarColor(){
    if( !this.id ) return false;
    this.data.colores = this.listColores;
    this.submit();
  }


  onScroll(){}


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
        this.data.dataMax = this.data;
        this.listGaleria.push( this.data );
        resolve(true);
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); });
    });
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
    datas =  _.omit(data, [ 'idEmpresa', 'image_galery', 'files']);
    datas.estado = datas.estado == true ? 0 : 2;
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

  openPublic( item:any ){
    console.log( item );
    this.id = item.id;
    this.data = item.dataMax;
  }

}
