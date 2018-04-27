import { Component } from '@angular/core';
import { Camera } from '../modules/camera';
import { MobileNet } from '../modules/mobilenet';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  sourceImg:HTMLImageElement;
  constructor(
    public camera:Camera,
    private mobileNet:MobileNet
  ){

  }

  async ngAfterViewInit(){
    this.camera.videoElement = <HTMLVideoElement>document.querySelector('#cameraelement');
    this.sourceImg = <HTMLImageElement>document.querySelector('#sourceImg');
    this.camera.setupCamera().then(value => {
      this.camera.setupVideoDimensions(value[0], value[1]);
    }).catch(err=>{
      console.log(err)
    })
    await this.mobileNet.loadModel();
    //this.predict()
  }

  async predict(){
    this.camera.pauseCamera();
    let result = tf.tidy(() => {
      const pixels = tf.fromPixels(this.camera.videoElement);
      const centerHeight = pixels.shape[0] / 2;
      const beginHeight = centerHeight - (224 / 2);
      const centerWidth = pixels.shape[1] / 2;
      const beginWidth = centerWidth - (224 / 2);
      const pixelsCropped = pixels.slice([beginHeight, beginWidth, 0],[224, 224, 3]);
      return this.mobileNet.predict(pixelsCropped)
    });
    let topK = await this.mobileNet.getTopKClasses(result, 10);
    let labels = []
    topK.forEach(function(item){
      labels.push(item.label+":"+item.value);
    })
    alert(JSON.stringify(labels));
  }
  restart(){
    this.camera.unPauseCamera()
  }
}
