import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugSignedOutPage } from './datatug-signed-out-page.component';

describe('SignedOutPage', () => {
  let component: DatatugSignedOutPage;
  let fixture: ComponentFixture<DatatugSignedOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatugSignedOutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatatugSignedOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
