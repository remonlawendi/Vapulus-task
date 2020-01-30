import { AddContactComponent } from "./add-contact/add-contact.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "contacts/list",
    pathMatch: "full"
  },
  {
    path: "contacts/list",
    component: ContactListComponent
  },
  {
    path: "contacts/create",
    component: AddContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
