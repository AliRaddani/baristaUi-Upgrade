import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { ClusterModel } from '../models/cluster.model';
import { NodeModel } from '../models/node.model';
import { StorageService } from './storage.service';
import { PluginModel } from '../models/plugin.model';
import { PluginNodeModel } from '../models/plugin-node.model';
import { DiagnosticsPluginModel } from '../models/diagnostics-plugin-model';
import { SelectedItemModel } from '../models/selectedItem.model';
import { PluginNodeConfigModel } from '../models/plugin-node-config.model';

@Injectable({
  providedIn: 'root'
})
export class BaristaService {
  private storageClusterName = 'clusters';
  public clusters: Array<ClusterModel> = null;
  constructor(private http: HttpClient, private storage: StorageService) { }
  public selectedItem: SelectedItemModel;
  public plugins: Array<PluginModel> = [];
  public clusterPluginConfigurations: Array<PluginNodeConfigModel> = [];
  public isCluster: boolean;
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
    this.selectedItem = new SelectedItemModel({ type: 'Cluster', name: cluster.name });
    const url = cluster.endPoint + '/api/cluster/plugins';
    return this.http.get<any>(url, options).pipe(
      take(1),
      map((clusterPlugins: Array<any>) => {

        clusterPlugins.forEach(resultPlugin => {
          const plugin = new PluginModel({ name: resultPlugin.Name, clusterName: cluster.name });
          if (resultPlugin.Nodes) {
            const pluginNodes: Array<PluginNodeModel> = [];
            resultPlugin.Nodes.forEach(resultNode => {

              const pluginNode = new PluginNodeModel({
                status: resultNode.Status, version: resultNode.Version, name: resultNode.Node,
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
                pluginNode.diagnostics = diagnostics;
              }
              pluginNodes.push(pluginNode);

            });
            plugin.nodes = pluginNodes;
            plugin.rollupProperties();
          }
          this.plugins.push(plugin);
        });
        this.isCluster = true;
        return this.plugins;
      }));
  }

  getNodePlugins$(node: NodeModel): Observable<PluginModel[]> {
    const options = {
      withCredentials: true
    };
    this.selectedItem = new SelectedItemModel({ type: 'Node', name: node.hostName });
    const url = 'http://' + node.hostName + ':' + node.port + '/api/plugins';
    return this.http.get<any>(url, options).pipe(
      take(1),
      map((nodePlugin: Array<any>) => {
        nodePlugin.forEach(resultPlugin => {
          const pluginNode = new PluginNodeModel({
            name: resultPlugin.Name, status: resultPlugin.Status, version: resultPlugin.Version, node
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
            pluginNode.diagnostics = diagnostics;
          }
          const plugin = new PluginModel({
            clusterName: node.hostName,
            diagnostics: pluginNode.diagnostics,
            name: resultPlugin.Name,

            nodes: [pluginNode],
            status: pluginNode.status,
            isMonitored: pluginNode.isMonitored,
            version: pluginNode.version,
          });
          this.plugins.push(plugin);
        });
        this.isCluster = false;
        return this.plugins;
      }));
  }

  pluginsForDisplay() {
    const pluginsArray: Array<any> = this.plugins;
    this.plugins = [];
    return pluginsArray;
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

  getClusterPluginConfigs$(plugName: string): Observable<PluginNodeConfigModel[]> {
    const options = {
      withCredentials: true
    };
    const url = 'http://asi-barsn1-02.asinetwork.local:8080/api/cluster/' + plugName + '/config';
    // const url = `http://{plugin.nodeName}/api/plugins/{pluginName}/config`;
    return this.http.get<any>(url, options).pipe(
      take(1),
      map((clusterPluginConfig: Array<any>) => {
        this.clusterPluginConfigurations = [];
        clusterPluginConfig.forEach(config => {
          const configuration = new PluginNodeConfigModel({
            nodeName: config.Node, appSettings: config.Response.AppSettings, connectionStrings: config.Response.ConnectionStrings
          });

          this.clusterPluginConfigurations.push(configuration);
        });
        return this.clusterPluginConfigurations;
      }));
  }

  getNodePluginConfig$(plugName: string, node: PluginModel[]): Observable<PluginNodeConfigModel[]> {
    const options = {
      withCredentials: true
    };
    const url = 'http://' + node[0].clusterName + ':8080/api/plugins/' + plugName + '/config';
    // const url = `http://{plugin.nodeName}/api/plugins/{pluginName}/config`;
    return this.http.get<any>(url, options).pipe(
      take(1),
      map(clusterPluginConfig => {
        this.clusterPluginConfigurations = [];
        const configuration = new PluginNodeConfigModel({

          nodeName: node[0].clusterName, appSettings: clusterPluginConfig.AppSettings, 
          connectionStrings: clusterPluginConfig.ConnectionStrings
        });

        this.clusterPluginConfigurations.push(configuration);

        return this.clusterPluginConfigurations;
      }));
  }
}
