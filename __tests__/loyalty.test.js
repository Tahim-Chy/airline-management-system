import { tierForPoints, pointsForSpend } from '../models/loyaltyModel';

describe('tierForPoints', () => {
  test('0 points is Bronze', () => {
    expect(tierForPoints(0)).toBe('Bronze');
  });
  test('499 points is still Bronze', () => {
    expect(tierForPoints(499)).toBe('Bronze');
  });
  test('500 points reaches Silver', () => {
    expect(tierForPoints(500)).toBe('Silver');
  });
  test('1999 points is still Silver', () => {
    expect(tierForPoints(1999)).toBe('Silver');
  });
  test('2000 points reaches Gold', () => {
    expect(tierForPoints(2000)).toBe('Gold');
  });
  test('5000 points reaches Platinum', () => {
    expect(tierForPoints(5000)).toBe('Platinum');
  });
  test('10000 points is still Platinum (no tier above it)', () => {
    expect(tierForPoints(10000)).toBe('Platinum');
  });
});

describe('pointsForSpend', () => {
  test('awards 10 points per $100 spent', () => {
    expect(pointsForSpend(100)).toBe(10);
  });
  test('awards 0 points for $0', () => {
    expect(pointsForSpend(0)).toBe(0);
  });
  test('rounds to the nearest whole point', () => {
    expect(pointsForSpend(455)).toBe(46); // 45.5 rounds to 46
  });
});
