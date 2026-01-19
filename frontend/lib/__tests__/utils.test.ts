import { cn } from '../utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2', 'py-4');
    expect(result).toBe('px-2 py-4');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('active-class');
  });

  it('should merge tailwind classes correctly', () => {
    // twMerge should resolve conflicts, later class wins
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'extra');
    expect(result).toBe('base extra');
  });
});
