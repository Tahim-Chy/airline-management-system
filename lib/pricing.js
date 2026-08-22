// Pure function — no DB access — so it's easy to unit test and explain in a demo.
// Adjusts a flight's base price based on how full it is (occupancy) and how soon
// it departs (urgency), the way real airline fare systems approximate demand.
export function calculateDynamicPrice(flight) {
  const basePrice = Number(flight.price);

  const occupancyRatio = 1 - flight.available_seats / flight.total_seats; // 0 = empty, 1 = full
  let occupancyMultiplier = 1.0;
  if (occupancyRatio >= 0.8) occupancyMultiplier = 1.5;
  else if (occupancyRatio >= 0.5) occupancyMultiplier = 1.2;

  const daysUntilDeparture = Math.max(
    0,
    Math.ceil((new Date(flight.departure_time) - new Date()) / (1000 * 60 * 60 * 24))
  );
  let urgencyMultiplier = 1.0;
  if (daysUntilDeparture <= 3) urgencyMultiplier = 1.3;
  else if (daysUntilDeparture <= 14) urgencyMultiplier = 1.1;

  const dynamicPrice = basePrice * occupancyMultiplier * urgencyMultiplier;

  return {
    base_price: basePrice,
    occupancy_multiplier: occupancyMultiplier,
    urgency_multiplier: urgencyMultiplier,
    dynamic_price: Number(dynamicPrice.toFixed(2)),
  };
}
