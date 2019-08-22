import { DiagnosticsPluginModel } from './diagnostics-plugin-model';
import { PluginNodeModel } from './plugin-node.model';
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
    nodeName: string;

    public constructor(init?: Partial<PluginModel>) {
        Object.assign(this, init);
    }

    public rollupProperties() {
        if (this.nodes) {

            if (this.nodes.every(node => node.status === 'Deployed')) {
                this.status = 'Deployed';
            } else if (this.nodes.every(node => node.status === 'Running')) {
                this.status = 'Running';

            } else if (this.nodes.every(node => node.status === 'Offline')) {
                this.status = 'Offline';
            } else if (this.nodes.some(node => node.status === 'Installed')) {
                this.status = 'Installed';
            } else if (this.nodes.some(node => node.status === 'Running')) {
                this.status = 'Running';
            } else if (this.nodes.some(node => node.status === 'Failed')) {
                this.status = 'Failed';}
            if (this.nodes && this.nodes.length > 0) {
                let version;
                this.nodes.forEach(node => {
                    if (!version) {
                        version = node.version;
                    } else if (node.version !== version) {
                        version = 'Mixed Version';
                    }
                });
                this.version = version;
            }
        }
    }
}
