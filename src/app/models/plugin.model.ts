import { DiagnosticsPluginModel } from './diagnostics-plugin-model';
import { PluginNodeModel } from './pluginNode.model';
import { NodeModel } from './node.model';


export class PluginModel {
    clusterName: string;
    name: string;
    status: string;
    version: string;
    diagnostics: DiagnosticsPluginModel;
    isMonitored: string;
    HasAp: string;
    nodes?: PluginNodeModel[];
    endPoint: string;
    node?: NodeModel;


    public constructor(init?: Partial<PluginModel>) {
        Object.assign(this, init);
    }

    public rollupProperties() {
        if (this.nodes) {
            this.nodes.filter( node => {
                return node.status !== 'Deployed';
            }).map((node) => {
                if ( node.status === 'Offline') {
                    this.status = 'Offline';
                    this.version = '';
                } else if ( node.status === 'Running') {
                    this.status = 'Running';
                    this.version = node.version;
                } else if (node.status === 'Stopped') {
                    this.status = 'Stopped';
                } else if (node.status === 'Installed') {
                    this.status = 'Installed';
                    this.version = node.version;
                }
            });
            if (this.nodes.every(node => node.status === 'Deployed')) {
                    this.status = 'Deployed';
            }


        }

    }
}
