import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TelegramMiniAppHomePageComponent } from './telegram-mini-app-home-page.component';

describe('TelegramMiniAppHomePageComponent', () => {
  let component: TelegramMiniAppHomePageComponent;
  let fixture: ComponentFixture<TelegramMiniAppHomePageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TelegramMiniAppHomePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(TelegramMiniAppHomePageComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(TelegramMiniAppHomePageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
