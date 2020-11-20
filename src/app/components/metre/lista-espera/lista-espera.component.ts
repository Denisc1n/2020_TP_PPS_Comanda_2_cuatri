import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FirebaseService } from "src/app/servicios/firebase.service";

import { AngularFirestore } from "angularfire2/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-lista-espera",
  templateUrl: "./lista-espera.component.html",
  styleUrls: ["./lista-espera.component.scss"],
})
export class ListaEsperaComponent implements OnInit {
  clientes = [];
  mesas;
  clienteSeleccionado: any;
  showOwnControls = false;
  @Output() volver: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private fireService: FirebaseService,
    private db: AngularFirestore,
    private route: Router
  ) {
    this.traerLista();
  }

  ngOnInit() {
    //this.fireService.snapshotsarasa(this.traerLista());
  }

  back() {
    this.volver.emit("home");
  }

  traerLista() {
    this.fireService.getDB("listaEspera").then((datos: any) => {
      datos.forEach((element) => {
        if (!element.asignado) {
          this.clientes.push(element);
        }
      });
      //this.clientes = datos;

      if (this.clientes.length == 0) {
        document.getElementById("msj-espera").innerHTML =
          "No hay clientes en espera";
      }
    });
  }

  selectCustomer(cliente) {
    this.clienteSeleccionado = cliente;
  }

  actualizarListaMesas() {
    this.fireService.getDB("mesas").then((datos) => (this.mesas = datos));
  }

  handleReturn($event) {
    this.volver.emit("listaEspera");
  }
}
