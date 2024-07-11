import { __decorate, __metadata, __param } from "tslib";
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/logging';
import { TeamsListComponent } from '@sneat/team-components';
import { spaceContextFromBrief, zipMapBriefsWithIDs, } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
let ForTeamTypeCardComponent = class ForTeamTypeCardComponent extends SneatBaseComponent {
    constructor(errorLogger, userService, changeDetectorRef) {
        super('ForTeamTypeCardComponent', errorLogger);
        this.userService = userService;
        this.changeDetectorRef = changeDetectorRef;
    }
    ngOnChanges(changes) {
        if (changes['teamTypes']) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            this.watchUserRecord();
        }
    }
    watchUserRecord() {
        this.subscription = this.userService.userState
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
            next: (user) => {
                this.teams = zipMapBriefsWithIDs(user.record?.teams)
                    ?.filter((t) => this.teamTypes?.some((tt) => tt === t.brief.type))
                    .map((t) => spaceContextFromBrief(t.id, t.brief));
                console.log('ForTeamTypeCardComponent =>', this.teamTypes, user.record?.teams, this.teams);
                this.changeDetectorRef.markForCheck();
            },
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ForTeamTypeCardComponent.prototype, "emptyTitle", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ForTeamTypeCardComponent.prototype, "itemsTitle", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ForTeamTypeCardComponent.prototype, "buttonColor", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ForTeamTypeCardComponent.prototype, "newTeamButtonText", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ForTeamTypeCardComponent.prototype, "singleTeamButtonText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ForTeamTypeCardComponent.prototype, "teamTypes", void 0);
ForTeamTypeCardComponent = __decorate([
    Component({
        changeDetection: ChangeDetectionStrategy.OnPush,
        selector: 'sneat-for-team-card',
        templateUrl: 'for-team-type-card.component.html',
        standalone: true,
        imports: [CommonModule, IonicModule, RouterModule, TeamsListComponent],
    }),
    __param(0, Inject(ErrorLogger)),
    __metadata("design:paramtypes", [Object, SneatUserService,
        ChangeDetectorRef])
], ForTeamTypeCardComponent);
export { ForTeamTypeCardComponent };
//# sourceMappingURL=for-team-type-card.component.js.map