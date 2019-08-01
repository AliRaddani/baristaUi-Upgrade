export class DiagnosticsPluginModel {

    pluginMemory: string;
    totalAllocatedPluginMemory: string;
    survivedBaristaMemory: string;
    memoryUtilizationPercentage: string;
    pluginProcessorTime: string;
    pluginDiskUsage: string;
    deploymentDiskUsage: string;
    date: string;

    public constructor(init?: Partial<DiagnosticsPluginModel>) {
        Object.assign(this, init);
    }

}