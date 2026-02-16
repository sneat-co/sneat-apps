import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loggerFactory } from './logging';

describe('loggerFactory', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should throw error when logger name is empty string', () => {
    expect(() => loggerFactory.getLogger('')).toThrow(
      'Logger name is required',
    );
  });

  it('should throw error when logger name is null', () => {
    expect(() => loggerFactory.getLogger(null as unknown as string)).toThrow(
      'Logger name is required',
    );
  });

  it('should throw error when logger name is undefined', () => {
    expect(() =>
      loggerFactory.getLogger(undefined as unknown as string),
    ).toThrow('Logger name is required');
  });

  it('should return logger with valid name', () => {
    const logger = loggerFactory.getLogger('test-logger');
    expect(logger).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
  });

  it('should have debug method that calls console.log', () => {
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.debug('test message');

    expect(consoleSpy).toHaveBeenCalledWith('test message');
    consoleSpy.mockRestore();
  });

  it('should have info method that calls console.log', () => {
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.info('info message');

    expect(consoleSpy).toHaveBeenCalledWith('info message');
    consoleSpy.mockRestore();
  });

  it('should have warn method that calls console.warn', () => {
    const consoleSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.warn('warn message');

    expect(consoleSpy).toHaveBeenCalledWith('warn message');
    consoleSpy.mockRestore();
  });

  it('should have error method that calls console.error', () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.error('error message');

    expect(consoleSpy).toHaveBeenCalledWith('error message');
    consoleSpy.mockRestore();
  });

  it('should handle multiple arguments in debug', () => {
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.debug('message', { data: 'test' }, 123);

    expect(consoleSpy).toHaveBeenCalledWith('message', { data: 'test' }, 123);
    consoleSpy.mockRestore();
  });

  it('should handle multiple arguments in info', () => {
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.info('message', { data: 'test' }, 123);

    expect(consoleSpy).toHaveBeenCalledWith('message', { data: 'test' }, 123);
    consoleSpy.mockRestore();
  });

  it('should handle multiple arguments in warn', () => {
    const consoleSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.warn('message', { data: 'test' }, 123);

    expect(consoleSpy).toHaveBeenCalledWith('message', { data: 'test' }, 123);
    consoleSpy.mockRestore();
  });

  it('should handle multiple arguments in error', () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const logger = loggerFactory.getLogger('test-logger');

    logger.error('message', { data: 'test' }, 123);

    expect(consoleSpy).toHaveBeenCalledWith('message', { data: 'test' }, 123);
    consoleSpy.mockRestore();
  });
});
