import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  displayPlugins() {

    this.plugins = this.baristaService. pluginsForDisplay();
    console.log(this.plugins);
   }
   

}
