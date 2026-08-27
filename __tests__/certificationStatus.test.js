import { computeCertStatus } from '../controllers/certificationController';

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('computeCertStatus', () => {
  test('a date in the past is Expired', () => {
    expect(computeCertStatus(daysFromNow(-5))).toBe('Expired');
  });
  test('a date within 30 days is Expiring Soon', () => {
    expect(computeCertStatus(daysFromNow(15))).toBe('Expiring Soon');
  });
  test('a date exactly 30 days out is Expiring Soon', () => {
    expect(computeCertStatus(daysFromNow(30))).toBe('Expiring Soon');
  });
  test('a date more than 30 days out is Valid', () => {
    expect(computeCertStatus(daysFromNow(60))).toBe('Valid');
  });
});
