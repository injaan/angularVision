import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Camera } from '../modules/camera';
import { MobileNet } from '../modules/mobilenet';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    Camera,
    MobileNet
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
