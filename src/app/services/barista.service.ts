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
  public plugins: Array<PluginModel> = [];

  getCluster$(url: string): Observable<ClusterModel> | null {
    const options = {
      withCredentials: true
    };
    return this.http.get<any>(url + '/api/cluster', options).pipe(
      take(1),
      map(Plugin => {
        this.initClusters();
        if (this.clusters.findIndex(clust => clust.name === Plugin.Name) >= 0) {
          return null;
        } else {
          const cluster = new ClusterModel({ name: Plugin.Name, endPoint: url });
          if (Plugin.Nodes) {
            Plugin.Nodes.forEach(resultNode => {
              const node = new NodeModel({ hostName: resultNode.HostName, port: resultNode.Port });
              cluster.addNode(node);
            });
            this.clusters.push(cluster);
            this.storage.set(this.storageClusterName, this.clusters);
          }
          return cluster;
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
      map((Plugin: Array<any>) => {

        Plugin.forEach(resultPlugin => {
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
                    Diagnostics.hasOwnProperty('MemoryUtilizationPercentage') ? resultNode.Diagnostics.MemoryUtilizationPercentage : {},
                  pluginDiskUsage: resultNode.
                    Diagnostics.hasOwnProperty('PluginDiskUsage') ? resultNode.Diagnostics.PluginDiskUsage : {},
                  deploymentDiskUsage: resultNode.
                    Diagnostics.hasOwnProperty('DeploymentDiskUsage') ? resultNode.Diagnostics.DeploymentDiskUsage : {}
                });
                plugin.diagnostics = diagnostics;
              }
              pluginNodes.push(pluginNode);
              plugin.nodes = pluginNodes;
            });
          }
          this.plugins.push(plugin);

        });
        return this.plugins;
      }));
  }

  getNodePlugins$(cluster: ClusterModel, node: NodeModel): Observable<PluginModel[]> {

    const options = {
      withCredentials: true
    };
    const url = 'http://' + node.hostName + ':' + node.port + '/api/plugins';

    return this.http.get<any>(url, options).pipe(
      take(1),
      map((Plugin: Array<any>) => {
        Plugin.forEach(resultPlugin => {
          const plugin = new PluginModel({
            name: resultPlugin.Name, status: resultPlugin.Status, version: resultPlugin.Version
          });

          if (resultPlugin.hasOwnProperty('Diagnostics')) {

            const diagnostics = new DiagnosticsPluginModel({
              memoryUtilizationPercentage: resultPlugin.
                Diagnostics.hasOwnProperty('MemoryUtilizationPercentage') ? resultPlugin.Diagnostics.MemoryUtilizationPercentage : {},
              pluginDiskUsage: resultPlugin.
                Diagnostics.hasOwnProperty('PluginDiskUsage') ? resultPlugin.Diagnostics.PluginDiskUsage : {},
              deploymentDiskUsage: resultPlugin.
                Diagnostics.hasOwnProperty('DeploymentDiskUsage') ? resultPlugin.Diagnostics.DeploymentDiskUsage : {}
            });
            plugin.diagnostics = diagnostics;
          }
          this.plugins.push(plugin);

        });
        return this.plugins;

      }));
  }

  pluginsForDisplay() {

    return this.plugins;
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
