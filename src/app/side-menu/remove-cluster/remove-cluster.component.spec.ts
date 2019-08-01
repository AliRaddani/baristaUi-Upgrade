import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveClusterComponent } from './remove-cluster.component';

describe('RemoveClusterComponent', () => {
  let component: RemoveClusterComponent;
  let fixture: ComponentFixture<RemoveClusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveClusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
