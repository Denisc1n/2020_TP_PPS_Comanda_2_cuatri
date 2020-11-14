import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { PedidosService } from 'src/app/servicios/pedidos.service';

@Component({
  selector: 'app-cocinero',
  templateUrl: './cocinero.component.html',
  styleUrls: ['./cocinero.component.scss'],
})
export class CocineroComponent implements OnInit {

  @Output() volver:EventEmitter<any>=new EventEmitter<any>()
  consultas:any;
  mesaSeleccionada:any;
  firstTime = true;

  constructor(private fireService : FirebaseService, private db:AngularFirestore, private pedidosService:PedidosService) {
    this.actualizarLista()
   }

  ngOnInit() {
    this.db.collection('notificaciones').doc('cocinero').snapshotChanges().subscribe(data=>this.activarNotificacion())
  }

  back(){
    this.volver.emit('home')
  }

  actualizarLista(){
    this.fireService.getDB("mesas").then(datos=>this.consultas=datos)
  }

  displayModal(mesa:any)
  {
    (<HTMLInputElement>document.querySelector(".ctn-lista-mesas")).style.filter = "blur(5px)"
    this.mesaSeleccionada = mesa;
  }

  quitModal()
  {
    (<HTMLInputElement>document.querySelector(".ctn-lista-mesas")).style.filter = "none";
    this.mesaSeleccionada = null;
  }

  activarNotificacion(){
    if(!this.firstTime){
      alert('nuevo elemento en lista de espera')
    }
  }

  terminarPedido(numeroMesa){
    this.pedidosService.changeOrderStatus('pendienteComida', false, `Mesa ${numeroMesa} Buenos Muchachos`)
    this.fireService.sendNotification(`Mesa ${numeroMesa} Buenos Muchachos`, 'mozoComida')
    this.actualizarLista()
    this.quitModal()    
  }
}
