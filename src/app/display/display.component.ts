import { Component, OnInit } from '@angular/core';
import { BaristaService } from '../services/barista.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  public plugins: Array<any> = [];

  constructor(private baristaService: BaristaService) { }

  ngOnInit() {
  }

displayPlugins() {

 this.plugins = this.baristaService. pluginsForDisplay();
 console.log(this.plugins);
}

}
