import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssetListItemComponent } from './asset-list-item.component';
import { provideAssetusMocks } from '../testing/test-utils';
import { NavController } from '@ionic/angular/standalone';

describe('AssetListItemComponent', () => {
  let component: AssetListItemComponent;
  let fixture: ComponentFixture<AssetListItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetListItemComponent],
      providers: [
        ...provideAssetusMocks(),
        {
          provide: NavController,
          useValue: {
            navigateForward: vi.fn(),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
