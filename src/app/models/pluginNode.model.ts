import { DiagnosticsPluginModel } from './diagnostics-plugin-model';
import { NodeModel } from './node.model';


export class PluginNodeModel {

    node: NodeModel;
    status: string;
    version: string;
    diagnostics: DiagnosticsPluginModel;
    isMonitored: string;
    hasAp: string;

    public constructor(init?: Partial<PluginNodeModel>) {
        Object.assign(this, init);

    }
}