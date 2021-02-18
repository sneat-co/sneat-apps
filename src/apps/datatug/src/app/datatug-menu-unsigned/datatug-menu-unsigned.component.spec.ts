import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugMenuUnsignedComponent } from './datatug-menu-unsigned.component';

describe('DatatugMenuUnsignedComponent', () => {
  let component: DatatugMenuUnsignedComponent;
  let fixture: ComponentFixture<DatatugMenuUnsignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatugMenuUnsignedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatatugMenuUnsignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
