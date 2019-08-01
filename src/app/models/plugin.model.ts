import { DiagnosticsPluginModel } from './diagnostics-plugin-model';
import { PluginNodeModel } from './pluginNode.model';


export class PluginModel {
    name: string;
    status: string;
    version: string;
    diagnostics: DiagnosticsPluginModel;
    isMonitored: string;
    HasAp: string;
    nodes: PluginNodeModel[];

    public constructor(init?: Partial<PluginModel>) {
        Object.assign(this, init);
    }

    public rollupProperties() {
        if (this.nodes) {
            // calculate status
            // default version to first one
            // calculate diagnostics
        }
    }
}