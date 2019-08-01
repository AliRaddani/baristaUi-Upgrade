import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ClusterModel } from '../models/cluster.model';
import { NodeModel } from '../models/node.model';
import { StorageService } from './storage.service';
import { PluginModel } from '../models/plugin.model';
import { PluginNodeModel } from '../models/pluginNode.model';
import { DiagnosticsPluginModel } from '../models/diagnostics-plugin-model';

@Injectable({
  providedIn: 'root'
})
export class BaristaService {
  private storageClusterName = 'clusters';
  public clusters: Array<ClusterModel> = null;
  constructor(private http: HttpClient, private storage: StorageService) { }

  getCluster$(url: string): Observable<ClusterModel> | null {
    const options = {
      withCredentials: true
    };
    return this.http.get<any>(url + '/api/cluster', options).pipe(
      take(1),
      map(cluster => {
        this.initClusters();
        if (this.clusters.findIndex(clust => clust.name === cluster.Name) >= 0) {
          return null;
        } else {
          const myCluster = new ClusterModel({ name: cluster.Name, endPoint: url });
          if (cluster.Nodes) {
            cluster.Nodes.forEach(resultNode => {
              const node = new NodeModel({ hostName: resultNode.HostName, port: resultNode.Port });
              myCluster.addNode(node);
            });
            this.clusters.push(myCluster);
            this.storage.set(this.storageClusterName, this.clusters);
          }
          return myCluster;
        }
      }));
  }

  getClusterPlugins$(cluster: ClusterModel): Observable<PluginModel[]> {
    const options = {
      withCredentials: true
    };

    const url = cluster.endPoint + '/api/cluster/plugins';

    return this.http.get<any>(url, options).pipe(
      take(1),
      map((clusterPlugins: Array<any>) => {
        const plugins: Array<PluginModel> = [];
        clusterPlugins.forEach(resultPlugin => {
          const plugin = new PluginModel({ name: resultPlugin.Name });
          if (resultPlugin.Nodes) {

            resultPlugin.Nodes.forEach(resultNode => {
              const pluginNodes: Array<PluginNodeModel> = [];
              const pluginNode = new PluginNodeModel({
                status: resultNode.Status, version: resultNode.Version, node: resultNode.Node,
              });
              if (resultNode.hasOwnProperty('Diagnostics')) {

                const diagnostics = new DiagnosticsPluginModel({
                  memoryUtilizationPercentage: resultNode.
                    Diagnostics.hasOwnProperty('MemoryUtilizationPercentage') ? resultNode.Diagnostics.MemoryUtilizationPercentage : null,
                  pluginDiskUsage: resultNode.
                    Diagnostics.hasOwnProperty('PluginDiskUsage') ? resultNode.Diagnostics.PluginDiskUsage : null,
                  deploymentDiskUsage: resultNode.
                    Diagnostics.hasOwnProperty('DeploymentDiskUsage') ? resultNode.Diagnostics.DeploymentDiskUsage : null
                });
                plugin.diagnostics = diagnostics;
              }
              pluginNodes.push(pluginNode);
              plugin.nodes = pluginNodes;
            });
          }
          plugins.push(plugin);

        });
        return plugins;
      }));
  }

  getNodePlugins$(cluster: ClusterModel, node: NodeModel): Observable<PluginModel[]> {

    const options = {
      withCredentials: true
    };
    const url = 'http://' + node.hostName + ':' + node.port + '/api/plugins';

    return this.http.get<any>(url, options).pipe(
      take(1),
      map((clusterNodePlugins: Array<any>) => {
        const plugins: Array<PluginModel> = [];

        clusterNodePlugins.forEach(resultPlugin => {
          const plugin = new PluginModel({
            name: resultPlugin.Name, status: resultPlugin.Status, version: resultPlugin.Version
          });

          if (resultPlugin.hasOwnProperty('Diagnostics')) {

            const diagnostics = new DiagnosticsPluginModel({
              memoryUtilizationPercentage: resultPlugin.
                Diagnostics.hasOwnProperty('MemoryUtilizationPercentage') ? resultPlugin.Diagnostics.MemoryUtilizationPercentage : null,
              pluginDiskUsage: resultPlugin.
                Diagnostics.hasOwnProperty('PluginDiskUsage') ? resultPlugin.Diagnostics.PluginDiskUsage : null,
              deploymentDiskUsage: resultPlugin.
                Diagnostics.hasOwnProperty('DeploymentDiskUsage') ? resultPlugin.Diagnostics.DeploymentDiskUsage : null
            });
            plugin.diagnostics = diagnostics;
          }
          plugins.push(plugin);

        });
        return plugins;

      }));
  }

  getClusters() {
    this.initClusters();
    return [... this.clusters];
  }

  private initClusters() {
    if (this.clusters === null) {
      const storedValue = this.storage.get(this.storageClusterName);
      if (storedValue !== undefined && storedValue !== null) {
        this.clusters = storedValue;
      }
    }
    if (this.clusters === null) {
      this.clusters = [];
    }
  }
}
