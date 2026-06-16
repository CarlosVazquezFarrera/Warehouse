import { TestBed } from '@angular/core/testing';
import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  let pipe: NumberFormatPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumberFormatPipe]
    });
    pipe = TestBed.inject(NumberFormatPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number with comma separators', () => {
    expect(pipe.transform(1000)).toBe('1.000');
    expect(pipe.transform(1000000)).toBe('1.000.000');
  });

  it('should round decimals', () => {
    expect(pipe.transform(1000.5)).toBe('1.001');
    expect(pipe.transform(1000.4)).toBe('1.000');
  });

  it('should handle string input', () => {
    expect(pipe.transform('1000')).toBe('1.000');
  });

  it('should handle null and undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle invalid input', () => {
    expect(pipe.transform('abc')).toBe('');
  });
});
