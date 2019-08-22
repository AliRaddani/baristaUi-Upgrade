


export class NodeModel {
    hostName: string;
    port: number;

    public constructor(init?: Partial<NodeModel>) {
        Object.assign(this, init);
    }
}