import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedListComponent } from './archived-list.component';

describe('ArchivedListComponent', () => {
  let component: ArchivedListComponent;
  let fixture: ComponentFixture<ArchivedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ArchivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
