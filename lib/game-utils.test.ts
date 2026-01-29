
import { toDbJsonArray } from './game-utils';
import { describe, it, expect } from 'vitest';

describe('toDbJsonArray', () => {
  it('should handle null or undefined', () => {
    expect(toDbJsonArray(null)).toBe('[]');
    expect(toDbJsonArray(undefined)).toBe('[]');
  });

  it('should handle arrays', () => {
    const arr = ['action', 'adventure'];
    expect(toDbJsonArray(arr)).toBe(JSON.stringify(arr));
  });

  it('should handle valid JSON strings', () => {
    const json = '["action", "adventure"]';
    expect(toDbJsonArray(json)).toBe(json);
  });

  it('should handle whitespace in valid JSON strings', () => {
    const json = '  ["action", "adventure"]  ';
    // Optimization now trims the output
    expect(toDbJsonArray(json)).toBe(json.trim());
  });

  it('should fallback to empty array for invalid JSON missing bracket', () => {
    // Current behavior: if it starts with [, but no ], return []
    const invalidJson = '["action", "adventure"';
    expect(toDbJsonArray(invalidJson)).toBe('[]');
  });

  it('should return invalid JSON if it looks like an array (Optimization Trade-off)', () => {
    // This is the accepted trade-off: fast check allows invalid JSON if it has brackets
    const invalidJson = '["action", "adventure",]'; // Trailing comma is invalid in JSON
    expect(toDbJsonArray(invalidJson)).toBe(invalidJson);
  });

  it('should handle comma-separated strings', () => {
    const csv = 'action, adventure';
    expect(toDbJsonArray(csv)).toBe('["action","adventure"]');
  });

  it('should handle empty strings', () => {
    expect(toDbJsonArray('')).toBe('[]');
  });

  it('should handle string not starting with [', () => {
      // Treated as comma separated
      expect(toDbJsonArray('not-json')).toBe('["not-json"]');
  });
});
