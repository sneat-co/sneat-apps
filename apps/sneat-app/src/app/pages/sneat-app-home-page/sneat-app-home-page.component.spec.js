import { TestBed, waitForAsync } from '@angular/core/testing';
import { SneatAppHomePageComponent } from './sneat-app-home-page.component';
describe('SneatAppHomePageComponent', () => {
    let component;
    let fixture;
    beforeEach(waitForAsync(async () => {
        await TestBed.configureTestingModule({
            declarations: [SneatAppHomePageComponent],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SneatAppHomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=sneat-app-home-page.component.spec.js.map