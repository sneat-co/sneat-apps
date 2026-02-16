import { describe, it, expect } from 'vitest';
import {
  ILoginEventsHandler,
  LoginEventsHandler,
} from './sneat-auth.interface';

describe('sneat-auth.interface', () => {
  describe('LoginEventsHandler', () => {
    it('should be an InjectionToken', () => {
      expect(LoginEventsHandler).toBeDefined();
      expect(LoginEventsHandler.toString()).toContain('ILoginEventsHandler');
    });
  });

  describe('ILoginEventsHandler interface', () => {
    it('should be implemented by objects with onLoggedIn method', () => {
      const handler: ILoginEventsHandler = {
        onLoggedIn: () => {
          // Implementation
        },
      };

      expect(handler).toBeDefined();
      expect(typeof handler.onLoggedIn).toBe('function');
    });

    it('should allow onLoggedIn to be called', () => {
      let called = false;
      const handler: ILoginEventsHandler = {
        onLoggedIn: () => {
          called = true;
        },
      };

      handler.onLoggedIn();
      expect(called).toBe(true);
    });
  });
});
