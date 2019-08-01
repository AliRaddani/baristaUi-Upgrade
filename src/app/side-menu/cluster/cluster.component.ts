import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ClusterModel } from 'src/app/models/cluster.model';
import { NodeModel } from 'src/app/models/node.model';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  accordianClicked = true;

  constructor() { }

  @Input() clusters: ClusterModel[] = [];
  @Output() clickClusterPlugins = new EventEmitter<object>();
  @Output() clickNodePlugins = new EventEmitter<object>();


  nodeClick(cluster: ClusterModel, node: NodeModel) {
    const obj = {
      cluster: cluster,
      node: node
    };
    this.clickNodePlugins.emit(obj);
   }

   clusterClick(cluster: ClusterModel) {

    this.clickClusterPlugins.emit(cluster);
  }

  ngOnInit() {

  }

}