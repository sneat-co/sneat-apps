import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FolderPage } from './folder.page';
describe('FolderPage', () => {
    let component;
    let fixture;
    beforeEach(waitForAsync(async () => {
        await TestBed.configureTestingModule({
            declarations: [FolderPage],
            imports: [IonicModule.forRoot(), RouterTestingModule],
        }).compileComponents();
        fixture = TestBed.createComponent(FolderPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=folder.page.spec.js.map