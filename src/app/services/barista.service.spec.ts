import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BaristaService } from '../services/barista.service';
import { NodeModel } from '../models/node.model';
import { ClusterModel } from '../models/cluster.model';
import { StorageService } from './storage.service';
import { PluginModel } from '../models/plugin.model';
import { PluginNodeModel } from '../models/plugin-node.model';


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



  it('should rollup status', () => {
    const plugin1 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Running' }),
        new PluginNodeModel({ status: 'Stopped' })
      ]
    });
    const plugin2 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Stopped' }),
        new PluginNodeModel({ status: 'Running' })
      ]
    });
    const plugin3 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Deployed' }),
        new PluginNodeModel({ status: 'Deployed' })
      ]
    });
    const plugin4 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Installed' }),
        new PluginNodeModel({ status: 'Installed' })
      ]
    });
    const plugin5 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Running' }),
        new PluginNodeModel({ status: 'Running' })
      ]
    });
    const plugin6 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Offline' }),
        new PluginNodeModel({ status: 'Offline' })
      ]
    });
    const plugin7 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Deployed' }),
        new PluginNodeModel({ status: 'Running' })
      ]
    });
    const plugin8 = new PluginModel({
      nodes: [
        new PluginNodeModel({ status: 'Running' }),
        new PluginNodeModel({ status: 'Deployed' })
      ]
    });

    plugin1.rollupProperties();
    plugin2.rollupProperties();
    plugin3.rollupProperties();
    plugin4.rollupProperties();
    plugin5.rollupProperties();
    plugin6.rollupProperties();
    plugin7.rollupProperties();
    plugin8.rollupProperties();

    expect(plugin1.status).toBe('Running');
    expect(plugin2.status).toBe('Running');
    expect(plugin3.status).toBe('Deployed');
    expect(plugin4.status).toBe('Installed');
    expect(plugin5.status).toBe('Running');
    expect(plugin6.status).toBe('Offline');
    expect(plugin7.status).toBe('Running');
    expect(plugin8.status).toBe('Running');
  });

  it('should rollup version', () => {
    const plugin1 = new PluginModel({
      nodes: [
        new PluginNodeModel({ version: '1' }),
        new PluginNodeModel({ version: '1' })
      ]
    });
    const plugin2 = new PluginModel({
      nodes: [
        new PluginNodeModel({ version: '1' }),
        new PluginNodeModel({ version: '2' })
      ]
    });

    plugin1.rollupProperties();
    plugin2.rollupProperties();

    expect(plugin1.version).toBe('1');
    expect(plugin2.version).toBe('Mixed Version');
  });

  it('should retreive the plugin data', inject([HttpTestingController, BaristaService],
    (httpMock: HttpTestingController, baristaService: BaristaService) => {
      const cluster = new ClusterModel({ endPoint: 'http://test' });
      baristaService.getClusterPlugins$(cluster).subscribe(plugins => {
        expect(plugins).toBeTruthy();
        expect(plugins.length).toBeGreaterThan(1);
        expect(plugins[0].name).toBe('ASI.Barista.Plugins.AdAudit.AuditWriter.Plugin');
        expect(plugins[0].nodes[0].version).toBe('20190723-2242');
        expect(plugins[0].nodes[0].status).toBeTruthy();
        expect(plugins[1].nodes[0].diagnostics).toBeTruthy();
        expect(plugins[1].nodes[0].diagnostics.deploymentDiskUsage).toBe('15.52 MB');
        expect(plugins[1].nodes[0].diagnostics.pluginDiskUsage).toBe('15.52 MB');
        expect(plugins[1].nodes[0].diagnostics.memoryUtilizationPercentage).toBe('0 %');
      });
      const node = new NodeModel({ hostName: 'test', port: 80 });
      baristaService.getNodePlugins$(node).subscribe(plugins => {
        expect(plugins).toBeTruthy();
        expect(plugins.length).toBe(3);
        expect(plugins[0].name).toBe('ASI.Barista.Plugins.AdAudit.AuditWriter.Plugin');
        expect(plugins[0].nodes[0].version).toBe('20190723-2242');
        expect(plugins[0].nodes[0].status).toBeTruthy();
        expect(plugins[0].nodes[0].diagnostics).toBeTruthy();
        expect(plugins[0].nodes[0].diagnostics.deploymentDiskUsage).toBe('15.75 MB');
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
                Status: 'Deployed',
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

  it('should retrieve the plugin config data', inject([HttpTestingController, BaristaService],
    (httpMock: HttpTestingController, baristaService: BaristaService) => {
      const clusterPluginName = 'ASI.Barista.Plugins.Connect.Jobs.Plugin';
      baristaService.getClusterPluginConfigs$(clusterPluginName).subscribe(config => {
        expect(config).toBeTruthy();
        expect(config.length).toBeGreaterThan(1);
        expect(config[0].appSettings.EnvironmentName).toBe('STAGE');
        expect(config[1].nodeName).toBe('asi-barsn2-02.asinetwork.local:8080');

      });

      const nodePluginName = 'ASI.Barista.Plugins.Connect.Notifications';
      baristaService.getNodePluginConfig$(nodePluginName).subscribe(config => {
        expect(config).toBeTruthy();
        expect(config[0].appSettings.DailyCreditAlertSchedule).toBe('0 30 6 * * ?');



      });
      httpMock.expectOne({
        url: 'http://asi-barsn1-02.asinetwork.local:8080/api/cluster/ASI.Barista.Plugins.Connect.Jobs.Plugin/config',
        method: 'GET'
      }).flush(
        [
          {
            Node: 'asi-barsn1-02.asinetwork.local:8080',
            Response: {
              AppSettings: {
                // tslint:disable-next-line: max-line-length
                EsbConnectionString: 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser',
                // tslint:disable-next-line: max-line-length
                'EsbConnectionString:Scheduler': 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser;prefetchcount=5',
                PostLoadSchedule: '0 0 5 * * ?',
                EnvironmentName: 'STAGE',
                FromEmail: 'stage-creditconnect@asicentral.com',
                SOSRecipients: 'ahameed@asicentral.com,ORifat@asicentral.com'
              },
              ConnectionStrings: {
                // tslint:disable-next-line: max-line-length
                CreditConnectContext: 'Data Source=ASI-SQLSS-11.asinetwork.local;Initial Catalog=Connect;User ID=********;Password=********'
              }
            },
            StatusCode: 'OK',
            IsSuccess: true,
            ReasonPhrase: 'OK'
          },
          {
            Node: 'asi-barsn2-02.asinetwork.local:8080',
            Response: {
              AppSettings: {
                // tslint:disable-next-line: max-line-length
                EsbConnectionString: 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser',
                // tslint:disable-next-line: max-line-length
                'EsbConnectionString:Scheduler': 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser;prefetchcount=5',
                PostLoadSchedule: '0 0 5 * * ?',
                EnvironmentName: 'STAGE',
                FromEmail: 'stage-creditconnect@asicentral.com',
                SOSRecipients: 'ahameed@asicentral.com,ORifat@asicentral.com'
              },
              ConnectionStrings: {
                // tslint:disable-next-line: max-line-length
                CreditConnectContext: 'Data Source=ASI-SQLSS-11.asinetwork.local;Initial Catalog=Connect;User ID=********;Password=********'
              }
            },
            StatusCode: 'OK',
            IsSuccess: true,
            ReasonPhrase: 'OK'
          }
        ]
      );
      httpMock.expectOne({
        url: 'http://asi-barsn1-02.asinetwork.local:8080/api/plugins/ASI.Barista.Plugins.Connect.Jobs.Plugin/config',
        method: 'GET'
      }).flush(
        [
          {
            AppSettings: {
              // tslint:disable-next-line: max-line-length
              EsbConnectionString: 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser',
              // tslint:disable-next-line: max-line-length
              'EsbConnectionString:Scheduler': 'host=asi-rabbitscn1-04.asinetwork.local,asi-rabbitscn2-04.asinetwork.local;username=asiuser;password=asiuser;prefetchcount=5',
              MonitorListSchedule: '0 0 6 * * ?',
              DailyCreditAlertSchedule: '0 30 6 * * ?',
              EnvironmentName: 'STAGE',
              TestDailyEmailTo: 'STG-ConnectNonASI@asicentral.com,ahameed@asicentral.com,imahmood@asicentral.com,orifat@asicentral.com',
              AppUrl: 'https://connect.stage-asicentral.com',
              ContactUs: 'https://www.asicentral.com/asp/open/CustomerSupport/support.aspx',
              FeedBackLink: 'support@asicentral.com',
              FeedBackSubject: 'Feedback',
              ASIMagazines: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=7',
              Connect: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=18',
              ESPWeb: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=103',
              ESPAdvertising: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=24',
              ESPWebsites: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=22',
              EmailExpress: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=153',
              ASISalesPro: ' https://www.asicentral.com/ASIStore/products.aspx?prodID=193',
              ASICentral: ' https://www.asicentral.com/',
              TimAndrewsBlog: 'https://www.asicentral.com/news/blogs/tims-blog/',
              ASIFacebook: 'https://www.facebook.com/pages/ASICentral/55248546043',
              ASIYouTube: 'https://www.youtube.com/user/asicentral',
              ASITwitter: 'https://twitter.com/asicentral',
              AboutASI: 'https://www.asicentral.com/asp/open/AboutASI/default.aspx',
              PressReleases: 'https://www.asicentral.com/asp/open/AboutASI/pressRoom/default.aspx',
              ASICareers: 'https://www.asicentral.com/asicareers/index.asp',
              DailyMonitorListEmailFrom: 'stage-creditinfo@asicentral.com',
              DailyMonitorListEmailFromName: 'stage-creditinfo@asicentral.com',
              DailyCreditAlertEmailFrom: 'stage-creditalert@asicentral.com',
              DailyCreditAlertEmailFromName: 'stage-creditalert@asicentral.com',
              SOSEmailFrom: 'stage-creditconnect@asicentral.com',
              SOSEmailFromName: 'stage-creditconnect@asicentral.com',
              SOSEmailTo: 'ahameed@asicentral.com,ORifat@asicentral.com',
              MediaServerPath: '\\\\10.1.0.243\\MediaProjects\\Barista\\STAGE\\CreditConnect'
            },
            ConnectionStrings: {
              CreditConnectContext: 'Data Source=ASI-SQLSS-11.asinetwork.local;Initial Catalog=Connect;User ID=********;Password=********'
            }
          }]
      );
    }));
});
