import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ContactRoleService } from './contact-role.service';

describe('ContactRoleService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ContactRoleService],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactRoleService)).toBeTruthy();
  });

  describe('getContactRoleByID', () => {
    it('should return role from family group', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('member'));
      expect(result).toBeDefined();
      expect(result.id).toBe('member');
      expect(result.brief.title).toBe('Family member');
      expect(result.brief.emoji).toBe('👪');
    });

    it('should return role from kid group', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('teacher'));
      expect(result).toBeDefined();
      expect(result.id).toBe('teacher');
      expect(result.brief.title).toBe('Teacher');
      expect(result.brief.emoji).toBe('👩‍🏫');
    });

    it('should return role from house group', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('plumber'));
      expect(result).toBeDefined();
      expect(result.id).toBe('plumber');
      expect(result.brief.title).toBe('Plumber');
      expect(result.brief.emoji).toBe('🚽');
    });

    it('should return role from medical group', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('gp'));
      expect(result).toBeDefined();
      expect(result.id).toBe('gp');
      expect(result.brief.title).toBe('GP / Family doctor');
      expect(result.brief.emoji).toBe('🩺');
    });

    it('should return role from vehicle group', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('mechanic'));
      expect(result).toBeDefined();
      expect(result.id).toBe('mechanic');
      expect(result.brief.title).toBe('Mechanic');
      expect(result.brief.emoji).toBe('👨‍🔧');
    });

    it('should return default role for unknown ID', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('unknown-role'));
      expect(result).toBeDefined();
      expect(result.id).toBe('unknown-role');
      expect(result.brief.title).toBe('unknown-role');
    });

    it('should return electrician role', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('electrician'));
      expect(result.id).toBe('electrician');
      expect(result.brief.title).toBe('Electrician');
    });

    it('should return gardener role', async () => {
      const service = TestBed.inject(ContactRoleService);
      
      const result = await firstValueFrom(service.getContactRoleByID('gardener'));
      expect(result.id).toBe('gardener');
      expect(result.brief.title).toBe('Gardener');
    });
  });
});
