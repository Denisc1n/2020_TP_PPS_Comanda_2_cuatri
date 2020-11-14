import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { QRScannerService } from "src/app/servicios/qrscanner.service";
import { FirebaseService } from "src/app/servicios/firebase.service";
import { PedidosService } from "src/app/servicios/pedidos.service";
import { UtilidadService } from "src/app/servicios/utilidad.service";
import { VibrationService } from "src/app/servicios/vibration.service";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"],
})
export class ClienteComponent implements OnInit {
  mesaPedido: string;
  currentUser;
  dataCurrentUser;
  mesaOcupada: string;
  estadoCliente: string = null;
  encuesta: boolean = false;
  pago: boolean;
  mesaParaPagar: any;
  opt: string;
  encuestaTerminada: boolean = false;
  clienteEnMesa: boolean = false;

  constructor(
    private QRService: QRScannerService,
    private fireService: FirebaseService,
    private pedidoService: PedidosService,
    private utilidadService: UtilidadService,
    private vibrationService: VibrationService
  ) {
    this.currentUser = fireService.getCurrentUser();

    if (!this.currentUser.isAnonymous) {
      fireService
        .getDBByDoc("cliente", this.currentUser.email)
        .then((data) => (this.dataCurrentUser = data));
      fireService
        .getClientInTable(this.currentUser.email)
        .then((data: any) => {
          if (!data) {
            this.clienteEnMesa = false;
          } else {
            this.clienteEnMesa = true;
            this.mesaPedido = data[0].nombre;
            this.estadoCliente = "enMesa";
          }
        })
        .then(() => {
          if (!this.clienteEnMesa) {
            console.log("mesa? " + this.clienteEnMesa);
            this.fireService
              .getWaitingList(this.currentUser.email)
              .then((data: any) => {
                console.log("data? " + data);
                if (data != undefined) this.estadoCliente = "listaEspera";
              });
          }
        });
    } else {
      fireService
        .getDBByDoc("clientesInvitados", this.currentUser.uid)
        .then((data) => (this.dataCurrentUser = data));

      this.fireService
        .getWaitingList(this.currentUser.uid)
        .then((data: any) => {
          if (data != undefined) this.estadoCliente = "listaEspera";
        });
    }
  }

  ngOnInit() {}

  scanListaDeEspera() {
    this.QRService.scan().then((a: any) => {
      if (a.text == "listaDeEsperaBuenosMuchachos") {
        if (!this.currentUser.isAnonymous)
          this.fireService.createDocInDB(
            "listaEspera",
            this.currentUser.email,
            this.dataCurrentUser
          );
        else
          this.fireService.createDocInDB(
            "listaEspera",
            this.currentUser.uid,
            this.dataCurrentUser
          );

        this.estadoCliente = "listaEspera";
        this.fireService.sendNotification(this.currentUser.email, "metre");
      } else {
        console.error("Primero debe ir a la lista de espera");
        this.utilidadService.textoMostrar(
          "#modal-error-text-p-general",
          "Primero debes anotarte a la lista de espera",
          "#modal-error-general",
          "#container-client"
        );
        this.vibrationService.error();
      }
    });
  }

  scanMesa() {
    this.QRService.scan().then((a: any) => {
      this.fireService
        .getWaitingList(this.currentUser.email)
        .then((datos: any) => {
          if (datos != undefined) {
            this.fireService.getTable(a.text).then((data: any) => {
              if (this.estadoCliente == "listaEspera" && data != undefined) {
                if (!data.ocupada) {
                  data.ocupada = true;
                  data.cliente = this.dataCurrentUser;
                  switch (a.text) {
                    case "Mesa 1 Buenos Muchachos":
                      this.fireService.updateDoc("mesas", a.text, data);
                      this.estadoCliente = "enMesa";
                      this.mesaOcupada = "Mesa 1 Buenos Muchachos";
                      break;

                    case "Mesa 2 Buenos Muchachos":
                      this.fireService.updateDoc("mesas", a.text, data);
                      this.estadoCliente = "enMesa";
                      this.mesaOcupada = "Mesa 2 Buenos Muchachos";
                      break;

                    case "Mesa 3 Buenos Muchachos":
                      this.fireService.updateDoc("mesas", a.text, data);
                      this.estadoCliente = "enMesa";
                      this.mesaOcupada = "Mesa 3 Buenos Muchachos";
                      break;

                    case "Mesa 4 Buenos Muchachos":
                      this.fireService.updateDoc("mesas", a.text, data);
                      this.estadoCliente = "enMesa";
                      this.mesaOcupada = "Mesa 4 Buenos Muchachos";
                      break;

                    default:
                      console.error("el qr no es el correcto");
                      this.utilidadService.textoMostrar(
                        "#modal-error-text-p-general",
                        "El QR no es el correcto",
                        "#modal-error-general",
                        "#container-client"
                      );
                      this.vibrationService.error();
                  }
                } else {
                  console.error("mesa ocupada");
                  this.utilidadService.textoMostrar(
                    "#modal-error-text-p-general",
                    "La mesa se encuentra ocupada",
                    "#modal-error-general",
                    "#container-client"
                  );
                  this.vibrationService.error();
                }
              } else if (this.estadoCliente == "encuesta") {
                this.estadoCliente = "opts";
              } else {
                console.log("Codigo incorrecto");
              }
            });
          }
        });
    });
  }

  scanEncuesta() {
    this.QRService.scan().then((a: any) => {
      if (a.text == "Encuesta Buenos Muchachos") {
        this.encuesta = true;
      }
    });
  }

  pagar() {
    this.fireService
      .getTable(this.mesaOcupada ?? this.mesaPedido)
      .then((datos: any) => {
        datos.pagoPendiente = true;
        this.opt = "pagar";
        this.mesaParaPagar = datos;
        this.fireService.updateDoc(
          "mesas",
          this.mesaOcupada ?? this.mesaPedido,
          datos
        );
      });
  }

  irse() {
    this.pedidoService
      .isPaymentPending(this.mesaOcupada ?? this.mesaPedido)
      .then((a: any) => {
        if (!a.pagoPendiente) {
          this.fireService.removeFromWaitingList(this.currentUser.email);
          this.pago = true;
          this.estadoCliente = "despedida";
        } else {
          console.error("todavia no pagaste bro");
          this.utilidadService.textoMostrar(
            "#modal-error-text-p-general",
            "Todavía no has pagado",
            "#btn-pedir-cuenta",
            "#container-client"
          );
          this.vibrationService.error();
        }
      });
  }

  finalizar($event) {
    console.log($event);
    this.encuestaTerminada = true;
    this.estadoCliente = "opts";
    this.opt = "";
  }
}
