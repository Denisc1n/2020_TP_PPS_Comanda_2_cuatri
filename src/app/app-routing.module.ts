import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { ListadoMesasComponent } from "./components/metre/listado-mesas/listado-mesas.component";
import { ClienteHabilitadoGuard } from "./guards/cliente-habilitado.guard";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
    canActivate: [ClienteHabilitadoGuard],
  },
  {
    path: "",
    redirectTo: "/splash",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "splash",
    loadChildren: () => import("./app.module").then((m) => m.AppModule),
  },
  {
    path: "registro/:perfil",
    loadChildren: () =>
      import("./pages/registro/registro.module").then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: "menu",
    loadChildren: () =>
      import("./components/menu/menu.component").then((m) => m.MenuComponent),
  },
  {
    path: "despedida",

    loadChildren: () =>
      import(
        "./components/cliente/cliente-despedida/cliente-despedida.component"
      ).then((m) => m.ClienteDespedidaComponent),
  },
  {
    path: "listaMesas",
    component: ListadoMesasComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
