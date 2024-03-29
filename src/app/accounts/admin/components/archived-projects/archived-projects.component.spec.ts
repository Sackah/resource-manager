import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedProjectsComponent } from './archived-projects.component';

describe('ArchivedProjectsComponent', () => {
  let component: ArchivedProjectsComponent;
  let fixture: ComponentFixture<ArchivedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
