export class SelectedItemModel {
    name: string;
    type: string;

    public constructor(init?: Partial<SelectedItemModel>) {
        Object.assign(this, init);

    }
}
