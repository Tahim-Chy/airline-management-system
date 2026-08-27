import { calculateExtraFee } from '../models/baggageModel';

describe('calculateExtraFee', () => {
  test('first bag under 23kg is free', () => {
    expect(calculateExtraFee(20, 1)).toBe(0);
  });

  test('first bag exactly at 23kg is free', () => {
    expect(calculateExtraFee(23, 1)).toBe(0);
  });

  test('first bag over 23kg is charged $15 per kg over', () => {
    expect(calculateExtraFee(28, 1)).toBe(75); // 5kg over * $15
  });

  test('second bag adds a flat $50 fee even if under the weight limit', () => {
    expect(calculateExtraFee(20, 2)).toBe(50);
  });

  test('second bag combines the flat fee with the overweight charge', () => {
    expect(calculateExtraFee(28, 2)).toBe(125); // $50 flat + $75 overweight
  });
});
