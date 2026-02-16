import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { firstValueFrom } from 'rxjs';
import { ContactGroupService } from './contact-group-service';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    collection: vi.fn().mockReturnValue({}),
  };
});

describe('ContactGroupService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ContactGroupService,
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
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactGroupService)).toBeTruthy();
  });

  describe('getContactGroups', () => {
    it('should return default family contact groups', async () => {
      const service = TestBed.inject(ContactGroupService);

      const groups = await firstValueFrom(service.getContactGroups());
      expect(groups).toBeDefined();
      expect(groups.length).toBeGreaterThan(0);
      expect(groups.some((g) => g.id === 'family')).toBe(true);
      expect(groups.some((g) => g.id === 'kid')).toBe(true);
      expect(groups.some((g) => g.id === 'house')).toBe(true);
    });

    it('should include family group with roles', async () => {
      const service = TestBed.inject(ContactGroupService);

      const groups = await firstValueFrom(service.getContactGroups());
      const familyGroup = groups.find((g) => g.id === 'family');
      expect(familyGroup).toBeDefined();
      expect(familyGroup?.dbo.title).toBe('Family');
      expect(familyGroup?.dbo.emoji).toBe('👪');
      expect(familyGroup?.dbo.roles?.length).toBeGreaterThan(0);
    });
  });

  describe('getContactGroupByID', () => {
    it('should return family group by ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('family', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('family');
      expect(group.dbo.title).toBe('Family');
      expect(group.dbo.emoji).toBe('👪');
    });

    it('should return kid group by ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('kid', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('kid');
      expect(group.dbo.title).toBe('Kids');
      expect(group.dbo.emoji).toBe('🚸');
    });

    it('should return house group by ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('house', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('house');
      expect(group.dbo.title).toBe('House');
      expect(group.dbo.emoji).toBe('🏠');
    });

    it('should return medical group by ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('med', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('med');
      expect(group.dbo.title).toBe('Medical');
      expect(group.dbo.emoji).toBe('⚕️');
    });

    it('should return vehicle group by ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('vehicle', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('vehicle');
      expect(group.dbo.title).toBe('Vehicle');
      expect(group.dbo.emoji).toBe('🚗');
    });

    it('should return default group for unknown ID', async () => {
      const service = TestBed.inject(ContactGroupService);
      const space = { id: 'space1' };

      const group = await firstValueFrom(service.getContactGroupByID('unknown', space));
      expect(group).toBeDefined();
      expect(group.id).toBe('unknown');
      expect(group.dbo.title).toBe('unknown');
    });
  });
});
