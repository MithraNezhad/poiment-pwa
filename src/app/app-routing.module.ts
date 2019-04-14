import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { JoinComponent } from "./join/join.component";
import { CreateComponent } from "./create/create.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "join", component: JoinComponent },
  { path: "create", component: CreateComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
