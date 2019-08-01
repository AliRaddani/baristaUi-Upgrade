import { NodeModel } from './node.model';
export class ClusterModel {

    name: string;
    endPoint: string;
    nodes: NodeModel[];

    public constructor(init?: Partial<ClusterModel>) {
        Object.assign(this, init);
        if (!this.nodes) {
            this.nodes = [];
        }
    }

    public addNode(node: NodeModel): void {
        this.nodes.push(node);
    }
}