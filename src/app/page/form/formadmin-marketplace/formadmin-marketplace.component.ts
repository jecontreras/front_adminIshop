import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { DEPARTAMENTO } from 'src/app/JSON/departamentos';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { MerkaplaceService } from 'src/app/servicesComponents/merkaplace.service';

@Component({
  selector: 'app-formadmin-marketplace',
  templateUrl: './formadmin-marketplace.component.html',
  styleUrls: ['./formadmin-marketplace.component.scss']
})
export class FormadminMarketplaceComponent implements OnInit {

  editorConfig: any;
  data: any = {};
  file: any = {
    foto1: []
  };
  btnDisabled: boolean = false;
  titulo: string = "Creacion";
  dataUser: any = {};
  id: string;
  disableFile:boolean = false;
  formatoMoneda:any = {};
  listdepartamento:any = DEPARTAMENTO;
  listciudades:any = [];

  constructor(
    private _archivo: ArchivosService,
    private _markaplace: MerkaplaceService,
    private _tools: ToolsService,
    public sanitizer: DomSanitizer,
    private _store: Store<STORAGES>,
    private activate: ActivatedRoute,
    private Router: Router
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    this.editor();
    this.id = (this.activate.snapshot.paramMap.get('id'));
    //console.log(this.id);
    if (this.id) { this.titulo = "Editar"; this.getPublicacion() }
  }

  getRow(){
    this._markaplace.get( { where: { id: this.id }, limit: 1 } ).subscribe( ( res:any )=>{
      res = res.data[0];
      if( !res ) { return this._tools.tooast({ title: "Error id no encontrado", icon:"error"}) }
      this.data = res;
      this.blurdepartamento();
    },( error:any )=>{
      this._tools.tooast( {title: "Error de servidor", icon:"error" } );
    } );
  }

  blurdepartamento(){
    let filtro:any = this.listdepartamento.find( ( row:any )=> row.departamento == this.data.departamento );
    if( !filtro ) return false;
    this.listciudades = filtro.ciudades;
  }

  getPublicacion() {
    this._markaplace.get({ where: { id: this.id } }).subscribe((res: any) => {
      res = res.data[0];
      this.procesoEdit(res);
    }, error => { this._tools.tooast({ title: "Error de servidor", icon: "error" }); })
  }

  procesoEdit(res: any) {
    //console.log(res);
    this.data = res;
    this.ProbarUrl();
  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    try {
      this.file.foto1 = ev.target.files;
      if (this.file.foto1[0]) {
        this.data.foto = await this._archivo.getBase64(this.file.foto1[0]);
      }
    } catch (error) { }
  }

  async submitFile() {
    if( !this.file.foto1[0] ) return false;
    this.disableFile = true;
    await this.procesoSubidaImagen(this.file.foto1[0]);
    this.disableFile = false;
    return true;
  }

  async procesoSubidaImagen(file: any) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({});
      this._archivo.create( form ).subscribe((res: any) => {
        //console.log(form);
        this._tools.tooast({ title: "subido exitoso" });
        this.data.foto = res.files;
        this.data.optSubio = true;
        if ( this.id ) this.editar();
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  async submit() {
    let validando = this.validador();
    if( !validando ) return false;
    this.disableFile = true;
    if ( this.data.id ) this.editar();
    else this.guardar();
  }

  validador(){
    if( !this.data.titulo ) { this._tools.tooast( { title: "Error falta titulo de la publicacion ", icon: "error"}); return false; }
    if( !this.data.descripcion ) { this._tools.tooast( { title: "Es Necesario que defina una descripcion", icon: "error"}); return false; }
    if( !this.data.foto ) { this._tools.tooast( { title: "Error falta Imagen ", icon: "error"}); return false; }
    if( !this.data.departamento ) { this._tools.tooast( { title: "Error falta el departamento", icon: "error"}); return false; }
    if( !this.data.ciudad ) { this._tools.tooast( { title: "Error falta la ciudad ", icon: "error"}); return false; }
    return true;
  }

  async guardar() {
    this.data.user = this.dataUser.id;
    if( !this.data.optSubio ) { let reult:boolean = await this.submitFile(); if( !reult ) return false; }
    this._markaplace.create( this.data ).subscribe((res: any) => {
      this._tools.tooast({ title: "Publicacion Creada" });
      this.disableFile = false;
      this.Router.navigate( [ 'dashboard/TusPublicaciones' ]);
    }, (error: any) => { this._tools.tooast({ title: "Error de servidor", icon: 'error' }); this.disableFile = false; })
  }

  editar() {
    let data:any = _.omitBy(this.data, _.isNull);
    data = _.omit(this.data, [ 'user' ])
    this._markaplace.update( data ).subscribe((res: any) => {
      this._tools.tooast({ title: "Publicacion Actualizada" });
      this.disableFile = false;
    }, (error: any) => { this._tools.tooast({ title: "Error de servidor", icon: 'error' }); this.disableFile = false; })
  }

  crearDefecto() {
    this.disableFile = true;
    this._markaplace.get( { where: { estado: "activo", autocreo: false, state:0 }, sort: [{ clicks: "ASC" },{ createdAt: "ASC" }], limit: 1 } ).subscribe( ( res:any )=>{
      //console.log( res );
      res = res.data[0];
      this.disableFile = false;
      if( !res ) return false;
      delete res.id; delete res.clicks; delete res.updatedAt; delete res.user; delete res.createdAt; delete res.autocreo;
      this.data = res;
      this.ProbarUrl();
    }, error => { this._tools.tooast( { title: "Error de servidor", icon:"error" } ); this.disableFile = false; } );
  }

  eventoDescripcion() {

  }

  async ProbarUrl() {
  }

  editor() {
    let config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '300px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['bold', 'italic'],
        ['fontSize']
      ]
    };
    this.editorConfig = config;
  }

}
