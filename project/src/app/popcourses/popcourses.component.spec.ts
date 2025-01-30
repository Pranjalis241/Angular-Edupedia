import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopcoursesComponent } from './popcourses.component';

describe('PopcoursesComponent', () => {
  let component: PopcoursesComponent;
  let fixture: ComponentFixture<PopcoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopcoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
