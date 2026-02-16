import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ContactService } from './contact-service';
import { ContactusSpaceService } from './contactus-space.service';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    collection: vi.fn().mockReturnValue({}),
  };
});

describe('ContactService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
          },
        },
        {
          provide: ContactusSpaceService,
          useValue: {
            watchContactBriefs: vi.fn(() => of([])),
          },
        },
        {
          provide: SneatUserService,
          useValue: {
            userState: of({}),
            userChanged: of(undefined),
            currentUserID: undefined,
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactService)).toBeTruthy();
  });

  describe('createContact', () => {
    it('should call createSpaceItem with correct parameters', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const spaceRef = { id: 'space1' };
      const request = { title: 'John Doe' };
      const mockResponse = { id: 'contact1', brief: { id: 'contact1' }, dbo: undefined, space: { id: 'space1' } };

      vi.spyOn(apiService, 'post').mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.createContact(spaceRef, request as any));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteContact', () => {
    it('should validate request and call deleteSpaceItem', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = { spaceID: 'space1', contactID: 'contact1' };

      vi.spyOn(apiService, 'delete').mockReturnValue(of(undefined));

      await firstValueFrom(service.deleteContact(request));
      expect(apiService.delete).toHaveBeenCalledWith(
        'contactus/delete_contact',
        undefined,
        request,
      );
    });

    it('should throw error if spaceID is missing', () => {
      const service = TestBed.inject(ContactService);
      const request = { spaceID: '', contactID: 'contact1' };

      expect(() => service.deleteContact(request)).toThrow('spaceID parameters is required');
    });
  });

  describe('updateContact', () => {
    it('should call API with update request', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        names: { firstName: 'John', lastName: 'Doe' },
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.updateContact(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/update_contact',
        request,
      );
    });
  });

  describe('addContactCommChannel', () => {
    it('should call API to add communication channel', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        channelType: 'email' as any,
        channelID: 'test@example.com',
        type: 'work' as const,
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.addContactCommChannel(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/add_contact_comm_channel',
        request,
      );
    });
  });

  describe('updateContactCommChannel', () => {
    it('should call API to update communication channel', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        channelType: 'phone' as any,
        channelID: '+1234567890',
        newChannelID: '+0987654321',
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.updateContactCommChannel(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/update_contact_comm_channel',
        request,
      );
    });
  });

  describe('deleteContactCommChannel', () => {
    it('should call API to delete communication channel', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        channelType: 'email' as any,
        channelID: 'test@example.com',
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.deleteContactCommChannel(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/delete_contact_comm_channel',
        request,
      );
    });
  });

  describe('setContactsStatus', () => {
    it('should call API to set contacts status', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        status: 'archived' as const,
        contactIDs: ['contact1', 'contact2'],
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.setContactsStatus(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/set_contacts_status',
        request,
      );
    });

    it('should throw error if contactIDs is empty', async () => {
      const service = TestBed.inject(ContactService);
      const request = {
        spaceID: 'space1',
        status: 'active' as const,
        contactIDs: [],
      };

      await expect(firstValueFrom(service.setContactsStatus(request))).rejects.toThrow('at least 1 contact is required');
    });
  });

  describe('changeContactRole', () => {
    it('should call API to change member role', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        role: 'contributor' as any,
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of(undefined));

      await firstValueFrom(service.changeContactRole(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/change_member_role',
        request,
      );
    });
  });

  describe('removeSpaceMember', () => {
    it('should validate and call API to remove team member', async () => {
      const service = TestBed.inject(ContactService);
      const apiService = TestBed.inject(SneatApiService);
      const request = {
        spaceID: 'space1',
        contactID: 'contact1',
        message: 'Goodbye',
      };

      vi.spyOn(apiService, 'post').mockReturnValue(of({} as any));

      await firstValueFrom(service.removeSpaceMember(request));
      expect(apiService.post).toHaveBeenCalledWith(
        'contactus/remove_team_member',
        request,
      );
    });

    it('should throw error if validation fails', async () => {
      const service = TestBed.inject(ContactService);
      const request = { spaceID: '', contactID: 'contact1' };

      await expect(firstValueFrom(service.removeSpaceMember(request))).rejects.toThrow('spaceID parameters is required');
    });
  });

  describe('watchContactsByRole', () => {
    it('should call watchModuleSpaceItemsWithSpaceRef with status filter', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const filter = { status: 'active' };
      const mockContacts = [{ id: 'contact1', brief: { title: 'Contact 1' } }];

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of(mockContacts),
      );

      const result = await firstValueFrom(service.watchContactsByRole(space, filter));
      expect(result).toEqual(mockContacts);
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [{ field: 'status', value: 'active', operator: '==' }],
        },
      );
    });

    it('should call watchModuleSpaceItemsWithSpaceRef with no filter', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of([]),
      );

      await firstValueFrom(service.watchContactsByRole(space));
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [],
        },
      );
    });

    it('should call watchModuleSpaceItemsWithSpaceRef with role filter', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const filter = { role: 'member' as any };

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of([]),
      );

      await firstValueFrom(service.watchContactsByRole(space, filter));
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [
            {
              field: 'roles',
              operator: 'array-contains',
              value: 'member',
            },
          ],
        },
      );
    });

    it('should call watchModuleSpaceItemsWithSpaceRef with both filters', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const filter = { status: 'archived', role: 'admin' as any };

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of([]),
      );

      await firstValueFrom(service.watchContactsByRole(space, filter));
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [
            { field: 'status', value: 'archived', operator: '==' },
            {
              field: 'roles',
              operator: 'array-contains',
              value: 'admin',
            },
          ],
        },
      );
    });
  });

  describe('watchChildContacts', () => {
    it('should watch child contacts with default active status', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const parentID = 'parent1';
      const mockContacts = [{ id: 'child1', brief: { title: 'Child 1' } }];

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of(mockContacts),
      );

      const result = await firstValueFrom(service.watchChildContacts(space, parentID));
      expect(result).toEqual(mockContacts);
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [
            { field: 'parentContactID', value: 'parent1', operator: '==' },
            { field: 'status', value: 'active', operator: '==' },
          ],
        },
      );
    });

    it('should watch child contacts with archived status', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const parentID = 'parent1';

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of([]),
      );

      await firstValueFrom(
        service.watchChildContacts(space, parentID, { status: 'archived' }),
      );
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [
            { field: 'parentContactID', value: 'parent1', operator: '==' },
            { field: 'status', value: 'archived', operator: '==' },
          ],
        },
      );
    });

    it('should watch child contacts with role filter', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const parentID = 'parent1';

      vi.spyOn(service as any, 'watchModuleSpaceItemsWithSpaceRef').mockReturnValue(
        of([]),
      );

      await firstValueFrom(
        service.watchChildContacts(space, parentID, {
          status: 'active',
          role: 'member' as any,
        }),
      );
      expect((service as any).watchModuleSpaceItemsWithSpaceRef).toHaveBeenCalledWith(
        space,
        {
          filter: [
            { field: 'parentContactID', value: 'parent1', operator: '==' },
            { field: 'status', value: 'active', operator: '==' },
            {
              field: 'roles',
              operator: 'array-contains',
              value: 'member',
            },
          ],
        },
      );
    });
  });

  describe('watchContactsWithRole', () => {
    it('should watch contacts with specific role', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const role = 'admin';
      const mockContacts = [{ id: 'contact1', brief: { title: 'Admin User' } }];

      vi.spyOn(service, 'watchSpaceContacts').mockReturnValue(of(mockContacts));

      const result = await firstValueFrom(
        service.watchContactsWithRole(space, role),
      );
      expect(result).toEqual(mockContacts);
      expect(service.watchSpaceContacts).toHaveBeenCalledWith(space, 'active', [
        { field: 'roles', operator: '==', value: 'admin' },
      ]);
    });

    it('should watch contacts with role and archived status', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const role = 'member';

      vi.spyOn(service, 'watchSpaceContacts').mockReturnValue(of([]));

      await firstValueFrom(service.watchContactsWithRole(space, role, 'archived'));
      expect(service.watchSpaceContacts).toHaveBeenCalledWith(space, 'archived', [
        { field: 'roles', operator: '==', value: 'member' },
      ]);
    });

    it('should watch contacts with role and custom filters', async () => {
      const service = TestBed.inject(ContactService);
      const space = { id: 'space1' } as any;
      const role = 'contributor';
      const customFilter = [{ field: 'custom', operator: '==', value: 'test' }];

      vi.spyOn(service, 'watchSpaceContacts').mockReturnValue(of([]));

      await firstValueFrom(
        service.watchContactsWithRole(space, role, 'active', customFilter as any),
      );
      expect(service.watchSpaceContacts).toHaveBeenCalledWith(space, 'active', [
        { field: 'custom', operator: '==', value: 'test' },
        { field: 'roles', operator: '==', value: 'contributor' },
      ]);
    });
  });
});
