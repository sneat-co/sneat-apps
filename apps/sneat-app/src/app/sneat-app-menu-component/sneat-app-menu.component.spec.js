import { TestBed, waitForAsync } from '@angular/core/testing';
import { SneatAppMenuComponentComponent } from './sneat-app-menu-component.component';
describe('SneatAppMenuComponentComponent', () => {
    let component;
    let fixture;
    beforeEach(waitForAsync(async () => {
        await TestBed.configureTestingModule({
            declarations: [SneatAppMenuComponentComponent],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SneatAppMenuComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=sneat-app-menu.component.spec.js.map