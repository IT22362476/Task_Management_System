import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatCardComponent } from "src/app/shared/components/stat-card/stat-card.component";
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StatCardComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
