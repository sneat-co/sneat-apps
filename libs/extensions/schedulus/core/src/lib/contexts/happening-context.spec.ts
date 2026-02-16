import { newEmptyHappeningContext } from './happening-context';
import { ISpaceContext } from '@sneat/space-models';

describe('happening-context', () => {
  describe('newEmptyHappeningContext', () => {
    let mockSpace: ISpaceContext;

    beforeEach(() => {
      mockSpace = {
        id: 'space123',
        brief: { title: 'Test Space' },
      } as ISpaceContext;
    });

    it('should create empty happening context with single type', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'single',
        'activity',
        'draft'
      );

      expect(context).toBeDefined();
      expect(context.id).toBe('');
      expect(context.space).toBe(mockSpace);
      expect(context.brief.type).toBe('single');
      expect(context.brief.kind).toBe('activity');
      expect(context.brief.status).toBe('draft');
      expect(context.brief.title).toBe('');
    });

    it('should create empty happening context with recurring type', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'recurring',
        'appointment',
        'active'
      );

      expect(context.brief.type).toBe('recurring');
      expect(context.brief.kind).toBe('appointment');
      expect(context.brief.status).toBe('active');
    });

    it('should create empty happening context with task kind', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'single',
        'task',
        'active'
      );

      expect(context.brief.kind).toBe('task');
    });

    it('should create context with canceled status', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'single',
        'activity',
        'canceled'
      );

      expect(context.brief.status).toBe('canceled');
    });

    it('should create context with archived status', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'single',
        'activity',
        'archived'
      );

      expect(context.brief.status).toBe('archived');
    });

    it('should have dbo that matches brief', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'recurring',
        'appointment',
        'draft'
      );

      expect(context.dbo).toEqual(context.brief);
      expect(context.dbo.type).toBe('recurring');
      expect(context.dbo.kind).toBe('appointment');
      expect(context.dbo.status).toBe('draft');
      expect(context.dbo.title).toBe('');
    });

    it('should link to provided space context', () => {
      const context = newEmptyHappeningContext(
        mockSpace,
        'single',
        'activity',
        'draft'
      );

      expect(context.space.id).toBe('space123');
      expect(context.space.brief.title).toBe('Test Space');
    });
  });
});
