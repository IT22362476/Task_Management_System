import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSidebarComponent } from './employee-sidebar.component';

describe('EmployeeSidebarComponent', () => {
  let component: EmployeeSidebarComponent;
  let fixture: ComponentFixture<EmployeeSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSidebarComponent]
    });
    fixture = TestBed.createComponent(EmployeeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
