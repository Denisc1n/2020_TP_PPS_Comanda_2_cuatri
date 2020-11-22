import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import * as $ from "jquery";
import { VibrationService } from "../../../servicios/vibration.service";

@Component({
  selector: "app-home-metre",
  templateUrl: "./home-metre.component.html",
  styleUrls: ["./home-metre.component.scss"],
})
export class HomeMetreComponent implements OnInit {
  redirect: string = "home";
  firstTime = 0;
  tableCleared: string;
  constructor(
    private db: AngularFirestore,
    private vibrationService: VibrationService
  ) {}

  ngOnInit() {
    this.db
      .collection("notificaciones")
      .doc("metre")
      .snapshotChanges()
      .subscribe((data: any) => {
        if (!data?.payload?.data().emitida) {
          this.activarNotificacion();
          this.db
            .collection("notificaciones")
            .doc("metre")
            .update({ emitida: true });
        }
      });
    this.db
      .collection("notificaciones")
      .doc("metreMesaLiberada")
      .snapshotChanges()
      .subscribe((data: any) => {
        if (!data?.payload?.data().emitida) {
          this.tableCleared = data?.payload?.data().mesa;
          this.activarNotificacionMesaLibre();
          this.db
            .collection("notificaciones")
            .doc("metreMesaLiberada")
            .update({ emitida: true });
        }
      });
  }

  activarNotificacion() {
    $("#notificacion-push").css("top", "2%");
    $("#content-title").text("Nuevo usuario en lista de espera");
    $("#content-msj").text("Tiene un usuario nuevo en lista de espera");

    setTimeout(() => {
      $("#notificacion-push").css("top", "-15%");
    }, 3000);
  }

  activarNotificacionMesaLibre() {
    $("#notificacion-push").css("top", "2%");
    $("#content-title").text("¡Una mesa ha sido desocupada!");
    $("#content-msj").text(
      `La mesa ${this.tableCleared} esta disponible para asignacion.`
    );
    this.vibrationService.success();
    setTimeout(() => {
      $("#notificacion-push").css("top", "-15%");
    }, 3000);
  }
  handleReturn() {
    this.redirect = "listaEspera";
    console.log("return");
  }
}
