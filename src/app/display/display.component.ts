import { Component, OnInit } from '@angular/core';
import { PluginModel } from '../models/plugin.model';
import { PluginNodeConfigModel } from '../models/plugin-node-config.model';
import { BaristaService } from '../services/barista.service';
// import {Location} from '@angular/common';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],

})
export class DisplayComponent implements OnInit {
  appSettings: [{ [key: string]: string }] = [{}];
  connectionStrings: [{ [key: string]: string }] = [{}];
  constructor(private baristaService: BaristaService) { }

  public plugins: Array<PluginModel> = [];
  public clusterPluginconfigs: Array<PluginNodeConfigModel> = [];
  public configs = [];
  title: string;
  pName: string;
  showWidget = false;
  selectedIndex: number;
  showMainContent = true;
  pluginName: string;
  nodeForPlugin: string;
  ngOnInit() {

  }

  displayPlugins() {
    this.plugins = this.baristaService.pluginsForDisplay();
    if (this.baristaService.selectedItem) {
      this.title = this.baristaService.selectedItem.type;
      this.pName = this.baristaService.selectedItem.name;
    }

  }

  showPluginConfigData(name: string) {

    this.appSettings.length > 1 ? this.appSettings.length = 1 : null;
    this.connectionStrings.length > 1 ? this.connectionStrings.length = 1 : null;

    if (this.baristaService.isCluster === true) {
      this.baristaService.getClusterPluginConfigs$(name).subscribe((response: PluginNodeConfigModel[]) => {
        this.clusterPluginconfigs = response;
        this.getPluginConfigData();

      });
    } else {
      this.baristaService.getNodePluginConfig$(name, this.plugins).subscribe((response: PluginNodeConfigModel[]) => {
        this.clusterPluginconfigs = response;
        this.getPluginConfigData();

      });
    }
    this.showMainContent = this.showMainContent ? false : true;
    this.pluginName = name;

  }
  getPluginConfigData() {
    this.clusterPluginconfigs.forEach(v => {

      if (v.hasOwnProperty('appSettings')) {
        Object.keys(v.appSettings).forEach(value => {
          const keyName = value;
          this.appSettings.push({ key: keyName, value: v.appSettings[value] });
        });
      }
      if (v.hasOwnProperty('connectionStrings')) {
        Object.keys(v.connectionStrings).forEach(value => {
          const keyName = value;
          this.connectionStrings.push({ key: keyName, value: v.connectionStrings[value] });
        });
      }
    });
  }

  onSelect(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }

  goBack(): void {
    this.showMainContent = true;
  }

  getColor(status) {
    switch (status) {
      case 'Running':
        return 'rgb(92, 184, 92)';
      case 'Failed':
        return 'rgb(184, 92, 92)';
      default:
        return '#6a6b6b';
    }
  }

}


