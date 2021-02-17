import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugHomePage } from './datatug-home-page.component';

describe('HomePage', () => {
  let component: DatatugHomePage;
  let fixture: ComponentFixture<DatatugHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatatugHomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DatatugHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
