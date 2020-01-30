import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { AddContactComponent } from "./add-contact/add-contact.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ContactItemComponent } from "./contact-list/contact-item/contact-item.component";

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    AddContactComponent,
    ContactItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
