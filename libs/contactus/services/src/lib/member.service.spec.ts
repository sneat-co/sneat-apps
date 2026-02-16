import { TestBed } from '@angular/core/testing';
import { SpaceService } from '@sneat/space-services';
import { MemberService } from './member.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ContactusSpaceService } from './contactus-space.service';
import { SneatUserService } from '@sneat/auth-core';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    collection: vi.fn().mockReturnValue({}),
  };
});

describe('MemberService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MemberService,
        { provide: SpaceService, useValue: { team$: of() } },
        { provide: Firestore, useValue: { type: 'firestore' } },
        { provide: SneatApiService, useValue: {} },
        { provide: ContactusSpaceService, useValue: {} },
        { provide: SneatUserService, useValue: {} },
      ],
    }),
  );

  it('should be created', () => {
    const service: MemberService = TestBed.inject(MemberService);
    expect(service).toBeTruthy();
  });

  describe('acceptPersonalInvite', () => {
    it('should call API with token and request', async () => {
      const service = TestBed.inject(MemberService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        inviteID: 'invite1',
        pin: '1234',
        member: { id: 'member1' },
      } as any;
      const token = 'firebase-token';
      const mockResponse = { id: 'member1', title: 'John Doe' };

      apiService.setApiAuthToken = vi.fn();
      apiService.post = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.acceptPersonalInvite(request, token));
      expect(apiService.setApiAuthToken).toHaveBeenCalledWith(token);
      expect(apiService.post).toHaveBeenCalledWith(
        'invites/accept_personal_invite',
        request,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should not set token if token is empty', async () => {
      const service = TestBed.inject(MemberService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        inviteID: 'invite1',
        pin: '1234',
        member: { id: 'member1' },
      } as any;

      apiService.setApiAuthToken = vi.fn();
      apiService.post = vi.fn().mockReturnValue(of({}));

      await firstValueFrom(service.acceptPersonalInvite(request, ''));
      expect(apiService.setApiAuthToken).not.toHaveBeenCalled();
    });
  });

  describe('createMember', () => {
    it('should trim names and call API', async () => {
      const service = TestBed.inject(MemberService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        role: 'contributor' as any,
        names: {
          firstName: '  John  ',
          lastName: '  Doe  ',
        },
      } as any;
      const mockResponse = { id: 'member1' };

      apiService.post = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.createMember(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/create_member',
        expect.objectContaining({
          spaceID: 'space1',
          role: 'contributor',
          names: {
            firstName: 'John',
            lastName: 'Doe',
          },
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
