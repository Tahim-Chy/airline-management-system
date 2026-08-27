import { calculateDynamicPrice } from '../lib/pricing';

function makeFlight(overrides = {}) {
  const in20Days = new Date();
  in20Days.setDate(in20Days.getDate() + 20);
  return {
    price: 100,
    available_seats: 100,
    total_seats: 100,
    departure_time: in20Days.toISOString(),
    ...overrides,
  };
}

describe('calculateDynamicPrice', () => {
  test('returns the base price unchanged for an empty flight far in the future', () => {
    const result = calculateDynamicPrice(makeFlight());
    expect(result.dynamic_price).toBe(100);
    expect(result.occupancy_multiplier).toBe(1.0);
    expect(result.urgency_multiplier).toBe(1.0);
  });

  test('applies a 1.2x occupancy multiplier once a flight is 50%+ full', () => {
    const result = calculateDynamicPrice(makeFlight({ available_seats: 40, total_seats: 100 }));
    expect(result.occupancy_multiplier).toBe(1.2);
    expect(result.dynamic_price).toBe(120);
  });

  test('applies a 1.5x occupancy multiplier once a flight is 80%+ full', () => {
    const result = calculateDynamicPrice(makeFlight({ available_seats: 10, total_seats: 100 }));
    expect(result.occupancy_multiplier).toBe(1.5);
    expect(result.dynamic_price).toBe(150);
  });

  test('applies a 1.3x urgency multiplier within 3 days of departure', () => {
    const in2Days = new Date();
    in2Days.setDate(in2Days.getDate() + 2);
    const result = calculateDynamicPrice(makeFlight({ departure_time: in2Days.toISOString() }));
    expect(result.urgency_multiplier).toBe(1.3);
  });

  test('applies a 1.1x urgency multiplier within 4-14 days of departure', () => {
    const in10Days = new Date();
    in10Days.setDate(in10Days.getDate() + 10);
    const result = calculateDynamicPrice(makeFlight({ departure_time: in10Days.toISOString() }));
    expect(result.urgency_multiplier).toBe(1.1);
  });

  test('multiplies occupancy and urgency together when both apply', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const result = calculateDynamicPrice(makeFlight({ available_seats: 5, total_seats: 100, departure_time: tomorrow.toISOString() }));
    // 1.5 (occupancy) * 1.3 (urgency) * 100 (base) = 195
    expect(result.dynamic_price).toBe(195);
  });
});
