import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { RandomIdService } from '@sneat/random';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        InviteService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: SneatAuthStateService,
          useValue: {
            authState: of({ status: 'notAuthenticated' }),
            authStatus: of('notAuthenticated'),
          },
        },
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
            postAsAnonymous: vi.fn(),
            setApiAuthToken: vi.fn(),
          },
        },
        {
          provide: Auth,
          useValue: {},
        },
        {
          provide: RandomIdService,
          useValue: { newRandomId: vi.fn(() => 'test-id') },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(InviteService)).toBeTruthy();
  });

  describe('createInviteForMember', () => {
    it('should call API with request', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        to: { memberID: 'member1' },
        message: 'Welcome!',
      } as any;
      const mockResponse = { inviteID: 'invite1' };

      vi.spyOn(apiService, 'post').mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.createInviteForMember(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'invites/create_invite_for_member',
        expect.objectContaining({
          spaceID: 'space1',
          to: { memberID: 'member1' },
          message: 'Welcome!',
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should exclude empty fields from request', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        to: { memberID: 'member1' },
        message: undefined,
      } as any;

      vi.spyOn(apiService, 'post').mockReturnValue(of({}));

      await firstValueFrom(service.createInviteForMember(request));
      const callArgs = (apiService.post as any).mock.calls[0][1];
      expect(callArgs.message).toBeUndefined();
    });
  });

  describe('getInviteLinkForMember', () => {
    it('should call API with query parameters', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        to: { memberID: 'member1' },
      } as any;
      const mockResponse = { inviteLink: 'https://example.com/invite/123' };

      vi.spyOn(apiService, 'get').mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getInviteLinkForMember(request));
      expect(apiService.get).toHaveBeenCalledWith(
        'invites/invite_link_for_member?space=space1&member=member1',
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSpaceJoinInfo', () => {
    it('should call API and enrich response with invite details', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const inviteID = 'invite1';
      const pin = '1234';
      const mockResponse = {
        space: { id: 'space1', title: 'Team Space' },
        invite: { to: { channel: 'email', address: 'test@example.com' } },
        member: { id: 'member1' },
      };

      vi.spyOn(apiService, 'postAsAnonymous').mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getSpaceJoinInfo(inviteID, pin));
      expect(apiService.postAsAnonymous).toHaveBeenCalledWith(
        'space/join_info',
        { inviteID, pin },
      );
      expect(result.invite.id).toBe(inviteID);
      expect(result.invite.pin).toBe(pin);
    });
  });

  describe('rejectPersonalInvite', () => {
    it('should call API to reject invite', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const request = { inviteID: 'invite1', pin: '1234' } as any;

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.rejectPersonalInvite(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'invites/reject_personal_invite',
        request,
      );
    });
  });

  describe('acceptInviteByAuthenticatedUser', () => {
    it('should call API with accept request', async () => {
      const service = TestBed.inject(InviteService);
      const apiService = TestBed.inject(SneatApiService);
      const inviteInfo = {
        space: { id: 'space1' },
        invite: { id: 'invite1', pin: '1234' },
        member: { id: 'member1' },
      } as any;
      const mockResponse = { success: true };

      vi.spyOn(apiService, 'post').mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.acceptInviteByAuthenticatedUser(inviteInfo));
      expect(apiService.post).toHaveBeenCalledWith(
        'invites/accept_personal_invite',
        expect.objectContaining({
          spaceID: 'space1',
          inviteID: 'invite1',
          pin: '1234',
          member: { id: 'member1' },
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('acceptInviteByUnauthenticatedUser', () => {
    it('should throw error for non-email invites', async () => {
      const service = TestBed.inject(InviteService);
      const inviteInfo = {
        space: { id: 'space1' },
        invite: {
          id: 'invite1',
          pin: '1234',
          to: { channel: 'phone', address: '+1234567890' },
        },
        member: { id: 'member1' },
      } as any;

      await expect(firstValueFrom(service.acceptInviteByUnauthenticatedUser(inviteInfo))).rejects.toThrow('Only join from an email invites');
    });

    it('should throw error if email address is missing', async () => {
      const service = TestBed.inject(InviteService);
      const inviteInfo = {
        space: { id: 'space1' },
        invite: {
          id: 'invite1',
          pin: '1234',
          to: { channel: 'email', address: '' },
        },
        member: { id: 'member1' },
      } as any;

      await expect(firstValueFrom(service.acceptInviteByUnauthenticatedUser(inviteInfo))).rejects.toThrow('Only join from an email invites');
    });
  });
});
