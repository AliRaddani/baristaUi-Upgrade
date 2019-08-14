import { Component, OnInit } from '@angular/core';
import { BaristaService } from '../services/barista.service';
import { PluginModel } from '../models/plugin.model';
import { PluginNodeModel } from '../models/pluginNode.model';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor(private baristaService: BaristaService) { }

  public plugins: Array<PluginModel> = [];
  isCluster = true;
  title: string;
  version: string;
  pName: string;
  showWidget = false;

  ngOnInit() {

  }

  displayPlugins() {
    this.plugins = this.baristaService.pluginsForDisplay();
    if (this.isCluster) {
      this.title = 'Cluster';
      this.pName = this.plugins[0].clusterName;

    } else {
      this.title = 'Node';
      this.pName = this.plugins[0].node.hostName;
    }

  }
  formatTitle(pluginName: string): string {
    return pluginName.replace('ASI.Barista.Plugins.', '');
  }

}


