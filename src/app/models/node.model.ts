
import { ClusterModel } from './cluster.model';
import { DiagnosticsPluginModel } from './diagnostics-plugin-model';

export class NodeModel {
    hostName: string;
    port: number;

    public constructor(init?: Partial<NodeModel>) {
        Object.assign(this, init);
    }
}