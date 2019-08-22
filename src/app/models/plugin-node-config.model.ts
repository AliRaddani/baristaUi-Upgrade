import { NodeModel } from './node.model';


export class PluginNodeConfigModel {
    node: NodeModel;
    pluginName: string;
    appSettings: { [key: string]: string };
    connectionStrings: { [key: string]: string };
    nodeName: string;

    public constructor(init?: Partial<PluginNodeConfigModel>) {
        Object.assign(this, init);
    }
}
