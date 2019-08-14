import { Component, OnInit } from '@angular/core';
import { BaristaService } from '../services/barista.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  accordianThreeClicked = false;
  accordianTwoClicked = false;
  hostName = '';
  port = '8080';
  private clusterEndpoints: any = [];
  clusters: any = [];
  plugins: any = [];
  constructor(private baristaService: BaristaService) { }

  addCluster() {
    const url = this.getFormatedUrl(this.hostName, this.port);
    const endpoint = 'http://' + this.hostName + ':' + this.port;
    this.clusterEndpoints.push(endpoint);
    return this.baristaService.getCluster$(url)
      .subscribe((data) => {
        this.clusters.push(data);

        this.hostName = null;
      },
        (err) => {
          this.hostName = null;

        }
      );

  }
  getClusterPlugins(event) {

    this.baristaService.getClusterPlugins$(event).subscribe();
  }

  getNodePlugins(event) {

    this.baristaService.getNodePlugins$(event).subscribe();
  }
  private getFormatedUrl(host: string, port: string): string {
    const url = host.replace(/(.*?:\/\/)|(\/)/g, '');
    return `http://${url}:${port}`;
  }

  ngOnInit() {
    this.clusters = this.baristaService.getClusters();
  }

}
