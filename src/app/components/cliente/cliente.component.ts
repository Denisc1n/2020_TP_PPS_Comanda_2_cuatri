import { Component, OnInit } from '@angular/core';
import { QRScannerService } from 'src/app/servicios/qrscanner.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit {

  currentUser
  dataCurrentUser
  estaEnMesa:boolean;
  mesaOcupada:string;
  listaEspera: boolean;
  encuesta = false;

  constructor(private QRService:QRScannerService, private fireService:FirebaseService) {
    this.currentUser = fireService.getCurrentUser()

    if(!this.currentUser.isAnonymous){
      fireService.getDBByDoc('cliente', this.currentUser.email).then(data=>this.dataCurrentUser=data);

      this.fireService.getWaitingList(this.currentUser.email).then((data:any) => {
        if(data != undefined)
          this.listaEspera = true;
      });
    }
    else{
      fireService.getDBByDoc('clientesInvitados', this.currentUser.uid).then(data=>this.dataCurrentUser=data);
      this.fireService.getWaitingList(this.currentUser.uid).then((data:any) => {
        if(data != undefined)
          this.listaEspera = true;
      });
    }
  }
  ngOnInit() {}

  scanListaDeEspera(){
    this.QRService.scan().then((a:any)=>{
      if(a.text == 'listaDeEsperaBuenosMuchachos'){

        if(!this.currentUser.isAnonymous)
          this.fireService.createDocInDB('listaEspera', this.currentUser.email, this.dataCurrentUser)
        else
          this.fireService.createDocInDB('listaEspera', this.currentUser.uid, this.dataCurrentUser)

        this.listaEspera = true;
      }
      else{
        console.error('Primero debe ir a la lista de espera')
      }
    })
  }
  scanMesa()
  {
    this.QRService.scan().then((a:any)=>{
      this.fireService.getWaitingList(this.currentUser.email).then((datos:any) => {
        if(datos != undefined)
        {
          this.fireService.getTable(a.text).then((data:any) => {
            if(!data.ocupada)
            {
              this.dataCurrentUser.ocupada = true;
              switch(a.text)
              { 
                case 'Mesa 1 Buenos Muchachos':
                  this.fireService.updateDoc("mesas", a.text, this.dataCurrentUser)
                  this.estaEnMesa = true;
                  this.mesaOcupada = 'Mesa 1 Buenos Muchachos';
                  break;
                case 'Mesa 2 Buenos Muchachos':
                  this.fireService.updateDoc("mesas", a.text, this.dataCurrentUser)
                  this.estaEnMesa = true;
		  this.mesaOcupada = 'Mesa 2 Buenos Muchachos';
                  break;
                case 'Mesa 3 Buenos Muchachos':
                  this.fireService.updateDoc("mesas", a.text, this.dataCurrentUser)
                  this.estaEnMesa = true;
                  this.mesaOcupada = 'Mesa 3 Buenos Muchachos';
                  break;
                case 'Mesa 4 Buenos Muchachos':
                  this.fireService.updateDoc("mesas", a.text, this.dataCurrentUser)
                  this.estaEnMesa = true;
                  this.mesaOcupada = 'Mesa 4 Buenos Muchachos';
                  break;
                default:
                  console.log("el qr no es el correcto");
              }
            }
            else
              console.log("mesa ocupada");
          })
        }
      })
    })
  }

  scanEncuesta(){
    
  }
}
