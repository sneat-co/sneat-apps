import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FolderPageComponent } from './folder-page.component';

describe('FolderPage', () => {
	let component: FolderPageComponent;
	let fixture: ComponentFixture<FolderPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [FolderPageComponent],
			imports: [IonicModule.forRoot(), RouterTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(FolderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
