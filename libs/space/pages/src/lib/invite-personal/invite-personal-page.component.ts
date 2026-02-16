import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import {
  IMemberBrief,
  IAcceptPersonalInviteRequest,
  IPersonalInvite,
  IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { SneatUserService } from '@sneat/auth-core';
import { MemberService } from '@sneat/contactus-services';
import {
  IRejectPersonalInviteRequest,
  zipMapBriefsWithIDsAndSpaceRef,
} from '@sneat/space-models';
import { SneatApiService } from '@sneat/api';
import { RandomIdService } from '@sneat/random';
import { InviteService } from '@sneat/contactus-services';

@Component({
  imports: [
    IonItem,
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonList,
    IonLabel,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonInput,
    FormsModule,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  providers: [InviteService],
  selector: 'sneat-invite-personal-page',
  templateUrl: './invite-personal-page.component.html',
})
export class InvitePersonalPageComponent implements OnInit {
  private readonly afAuth = inject(Auth);
  private readonly userService = inject(SneatUserService);
  private readonly route = inject(ActivatedRoute);
  private readonly sneatApiService = inject(SneatApiService);
  private readonly memberService = inject(MemberService);
  private readonly inviteService = inject(InviteService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navController = inject(NavController);
  private readonly randomIdService = inject(RandomIdService);

  public fullName = '';
  public email = '';
  public pin = '';

  public hidePin?: boolean;

  public working = false;
  public accepting = false;
  public rejecting = false;

  public invite?: IPersonalInvite;
  public members?: readonly IContactWithBriefAndSpace[];

  private inviteId = '';
  private spaceID = '';

  constructor() {
    this.getPinFromUrl();
  }

  public ngOnInit() {
    this.route.queryParamMap.subscribe((qp) => {
      const inviteId = qp.get('id') || '';
      const spaceID = qp.get('space') || '';
      this.inviteId = inviteId;
      this.spaceID = spaceID;
      if (!inviteId) {
        this.errorLogger.logError('inviteId is not set');
      }
      if (!spaceID) {
        this.errorLogger.logError('spaceId is not set');
      }
      this.sneatApiService
        .getAsAnonymous<{
          invite?: IPersonalInvite;
          members?: Record<string, IMemberBrief>;
        }>(
          'invites/personal',
          new HttpParams({
            fromObject: { invite: inviteId, space: spaceID },
          }),
        )
        .subscribe({
          next: (response) => {
            this.invite = response.invite;
            this.members = zipMapBriefsWithIDsAndSpaceRef(
              { id: spaceID },
              response.members,
            )?.filter((m) => m.id !== response.invite?.memberID);
            if (response.invite) {
              this.fullName = response.invite.to.title || '';
              if (response.invite.to.channel === 'email') {
                this.email = response.invite.to.address || '';
              }
            }
          },
          error: (err) =>
            this.errorLogger.logError(err, 'Failed to load invite:'),
        });
    });
  }

  public join(): void {
    this.accepting = true;
    this.working = true;

    const acceptInvite = (token?: string) => {
      const request: IAcceptPersonalInviteRequest = {
        spaceID: this.spaceID,
        inviteID: this.inviteId,
        pin: this.pin,
        // email: this.email,
        // fullName: this.fullName,
      };
      if (!token) {
        throw new Error('token is undefined or empty');
      }
      this.memberService.acceptPersonalInvite(request, token).subscribe({
        next: (/*memberInfo*/) => {
          this.navController
            .navigateRoot('space', { queryParams: { id: this.spaceID } })
            .catch((err) => {
              this.errorLogger.logError(
                err,
                'Failed to navigate to team page after successfully joining a team',
              );
            });
        },
        error: (error) => {
          this.errorLogger.logError(error, 'Failed to join team');
          this.accepting = false;
          this.working = false;
        },
      });
    };

    if (this.userService.currentUserID) {
      acceptInvite(undefined);
    } else {
      // Move into service?
      const password = this.randomIdService.newRandomId();
      createUserWithEmailAndPassword(this.afAuth, this.email, password)
        .then((userCredential) => {
          if (!userCredential?.user) {
            return;
          }

          userCredential.user
            .getIdToken()
            .then((token) => {
              acceptInvite(token);
            })
            .catch((err) => {
              this.errorLogger.logError(err, 'Failed to get Firebase token');
            });
        })
        .catch((err) => {
          this.accepting = false;
          this.working = false;
          this.errorLogger.logError(err, 'Failed to create Firebase user');
        });
    }
  }

  public reject(): void {
    this.rejecting = true;
    this.working = true;
    const request: IRejectPersonalInviteRequest = {
      spaceID: this.spaceID,
      inviteID: this.inviteId,
      pin: this.pin,
    };
    this.inviteService.rejectPersonalInvite(request).subscribe(
      () => {
        this.navController.navigateRoot('spaces').catch((err) => {
          this.errorLogger.logError(
            err,
            'Failed to navigate to teams page after successfully refused joining a team',
          );
        });
      },
      (error) => {
        this.errorLogger.logError(error, 'Failed to join team');
        this.working = false;
        this.rejecting = false;
      },
    );
  }

  private getPinFromUrl(): void {
    const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
    if (m) {
      this.pin = m[1];
      this.hidePin = true;
    }
  }
}
