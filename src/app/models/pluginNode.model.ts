import { DiagnosticsPluginModel } from './diagnostics-plugin-model';
import { NodeModel } from './node.model';



export class PluginNodeModel {
    name: string;
    node: NodeModel;
    status: string;
    version: string;
    diagnostics: DiagnosticsPluginModel;
    isMonitored: string;
    hasAp: string;
    nodeName: string;

    public constructor(init?: Partial<PluginNodeModel>) {
        Object.assign(this, init);

    }
}
