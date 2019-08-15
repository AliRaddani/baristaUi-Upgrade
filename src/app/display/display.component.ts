import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { BaristaService } from '../services/barista.service';
import { PluginModel } from '../models/plugin.model';
// import {Location} from '@angular/common';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class DisplayComponent implements OnInit {

  constructor(private baristaService: BaristaService, private location: Location) { }

  public plugins: Array<PluginModel> = [];
  title: string;
  pName: string;
  showWidget = false;
  selectedIndex: number;
  showMainContent = true;
  pluginName: string;
  ngOnInit() {

  }

  displayPlugins() {
    this.plugins = this.baristaService.pluginsForDisplay();

    if (this.plugins[0].hasOwnProperty('nodes')) {

      this.title = 'Cluster';
      this.pName = this.plugins[0].clusterName;

    } else {

      this.title = 'Node';
      this.pName = this.plugins[0].node.hostName;
    }

  }
  ShowHideButton(name: string) {
    console.log(name);
    this.showMainContent = this.showMainContent ? false : true;
    this.pluginName = name;
    console.log('showMainContent', this.showMainContent);
 }

  onSelect(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }
  formatTitle(pluginName: string): string {
    return pluginName.replace('ASI.Barista.Plugins.', '');
  }
  goBack(): void {
    this.showMainContent = true;
  }

}


