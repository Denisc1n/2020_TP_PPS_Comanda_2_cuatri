import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.component.html',
  styleUrls: ['./home-mozo.component.scss'],
})
export class HomeMozoComponent implements OnInit {

  redirect = 'home'

  firstTimeConsulta = true;
  firstTimeComida = true;
  firstTimeBebida = true;
  constructor(private db:AngularFirestore) { }

  ngOnInit() {    
    this.db.collection('notificaciones').doc('mozoConsulta').snapshotChanges().subscribe(data=>this.activarNotificacionConsulta())
    this.db.collection('notificaciones').doc('mozoComida').snapshotChanges().subscribe(data=>this.activarNotificacionComida())
    this.db.collection('notificaciones').doc('mozoBebida').snapshotChanges().subscribe(data=>this.activarNotificacionBebida())

  }
activarNotificacionConsulta(){
  if(!this.firstTimeConsulta){
    alert('consulta nueva')
  }
}
activarNotificacionComida(){
  if(!this.firstTimeComida){
    alert('comida lista')
  }
}
activarNotificacionBebida(){
  if(!this.firstTimeBebida){
    alert('birra servida')
  }
}
}
