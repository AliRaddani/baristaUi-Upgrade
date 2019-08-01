import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BaristaService } from './barista.service';
import { NodeModel } from '../models/node.model';
import { ClusterModel } from '../models/cluster.model';
import { StorageService } from './storage.service';


describe('BaristaService', () => {
  beforeEach(() => {
    const mockStorageService = jasmine.createSpyObj('StorageService', ['get', 'set']);
    TestBed.configureTestingModule({
      providers: [BaristaService, { provide: StorageService, useValue: mockStorageService }],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    const service: BaristaService = TestBed.get(BaristaService);
    expect(service).toBeTruthy();
  });

  it('should retrieve the cluster data', inject([HttpTestingController, BaristaService],
    (httpMock: HttpTestingController, baristaService: BaristaService) => {

      baristaService.getCluster$('http://test').subscribe(cluster => {
        expect(cluster).toBeTruthy();
        expect(cluster.name).toBe('StageCluster');
        expect(cluster.nodes).toBeTruthy();
        expect(cluster.nodes.length).toBe(4);
        expect(cluster.nodes[0].hostName).toBe('asi-barsn1-02.asinetwork.local');
        expect(cluster.nodes[0] instanceof NodeModel).toBeTruthy();
        expect(cluster instanceof ClusterModel).toBeTruthy();
      });
      httpMock.expectOne({
        url: 'http://test/api/cluster',
        method: 'GET'
      }).flush(
        {
          Name: 'StageCluster',
          BroadcastPort: 8080,
          Nodes: [
            { HostName: 'asi-barsn1-02.asinetwork.local', IpAddress: '172.25.231.14', Port: 8080 },
            { HostName: 'asi-barsn3-02.asinetwork.local', IpAddress: '172.25.231.225', Port: 8080 },
            { HostName: 'asi-barsn4-02.asinetwork.local', IpAddress: '172.25.231.220', Port: 8080 },
            { HostName: 'asi-barsn5-02.asinetwork.local', IpAddress: '172.25.231.221', Port: 8080 }]
        });
    }));

  it('should retreive the plugin data', inject([HttpTestingController, BaristaService],
    (httpMock: HttpTestingController, baristaService: BaristaService) => {
      const cluster = new ClusterModel({ endPoint: 'http://test' });
      baristaService.getClusterPlugins$(cluster).subscribe(plugins => {
        expect(plugins).toBeTruthy();
        expect(plugins.length).toBeGreaterThan(1);
        expect(plugins[0].name).toBe('ASI.Barista.Plugins.AdAudit.AuditWriter.Plugin');
        expect(plugins[0].nodes[0].version).toBe('20190723-2242');
        expect(plugins[0].nodes[0].status).toBeTruthy();
        expect(plugins[0].nodes[0].diagnostics).toBeTruthy();
        expect(plugins[0].nodes[1].diagnostics.deploymentDiskUsage).toBe('7.49 MB');
        expect(plugins[0].nodes[1].diagnostics.pluginDiskUsage).toBe('170.49 MB');
        expect(plugins[0].nodes[1].diagnostics.memoryUtilizationPercentage).toBe('10 %');
      });
      const node = new NodeModel({ hostName: 'test', port: 80 });
      baristaService.getNodePlugins$(cluster, node).subscribe(plugins => {
        expect(plugins).toBeTruthy();
        expect(plugins.length).toBe(1);
        expect(plugins[0].name).toBe('ASI.Barista.Plugins.BulkEmail.BulkEmailPlugin');
        expect(plugins[0].nodes[0].version).toBe('20190118-1004');
        expect(plugins[1].nodes[0].status).toBeTruthy();
        expect(plugins[0].nodes[0].diagnostics).toBeTruthy();
        expect(plugins[0].nodes[0].diagnostics.deploymentDiskUsage).toBe('7.49 MB');
      });


      httpMock.expectOne({
        url: 'http://test/api/cluster/plugins',
        method: 'Get'
      }).flush(
        [
          {
            Name: 'ASI.Barista.Plugins.AdAudit.AuditWriter.Plugin',
            Nodes: [
              {
                Node: 'asi-barsn4-02.asinetwork.local:8080',
                Status: 'Running',
                Version: '20190723-2242',
                Diagnostics: {
                  PluginMemory: '12.16 KB',
                  TotalAllocatedPluginMemory: '53.36 MB',
                  SurvivedBaristaMemory: '1.87 MB',
                  MemoryUtilizationPercentage: '1 %',
                  PluginProcessorTime: '00:00:01.1406250',
                  PluginDiskUsage: '8.19 MB',
                  DeploymentDiskUsage: '15.75 MB',
                  Date: '2019-07-24T16:43:29.284Z'
                },
                IsMonitored: true,
                HasApi: true
              }
            ]
          },
          {
            Name: 'ASI.Barista.Plugins.Watchpost.WatchpostPlugin',
            Nodes: [
              {
                Node: 'asi-barsn1-02.asinetwork.local:8080',
                Status: 'Running',
                Version: '20180904-1130',
                Diagnostics: {
                  PluginMemory: '1.03 KB',
                  TotalAllocatedPluginMemory: '12.91 GB',
                  SurvivedBaristaMemory: '1.1 MB',
                  MemoryUtilizationPercentage: '0 %',
                  PluginProcessorTime: '00:02:59.3125000',
                  PluginDiskUsage: '15.52 MB',
                  DeploymentDiskUsage: '15.52 MB',
                  Date: '2019-07-24T16:43:29.628Z'
                },
                IsMonitored: true,
                HasApi: true
              },
              {
                Node: 'asi-barsn2-02.asinetwork.local:8080',
                Status: 'Running',
                Version: '20180904-1130',
                Diagnostics: {
                  PluginMemory: '628 bytes',
                  TotalAllocatedPluginMemory: '12.89 GB',
                  SurvivedBaristaMemory: '786.49 KB',
                  MemoryUtilizationPercentage: '0 %',
                  PluginProcessorTime: '00:03:07.7656250',
                  PluginDiskUsage: '15.52 MB',
                  DeploymentDiskUsage: '15.52 MB',
                  Date: '2019-07-24T16:43:29.992Z'
                },
                IsMonitored: true,
                HasApi: true
              }
            ]
          }
        ]
      );
      httpMock.expectOne({
        url: 'http://test:80/api/plugins',
        method: 'Get'
      }).flush(
        [{
          Name: 'ASI.Barista.Plugins.BulkEmail.BulkEmailPlugin',
          Status: 'Running',
          Version: '20190118-1004',
          Diagnostics: {
            PluginMemory: '668 bytes',
            TotalAllocatedPluginMemory: '138.71 MB',
            SurvivedBaristaMemory: '702.48 KB',
            MemoryUtilizationPercentage: '0 %',
            PluginProcessorTime: '00:00:01.9218750',
            PluginDiskUsage: '7.49 MB',
            DeploymentDiskUsage: '7.49 MB',
            Date: '2019-07-17T13:43:27.949Z'
          },
          IsMonitored: true,
          HasApi: true
        }]
      );
    }));
});