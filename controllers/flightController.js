import { getAllFlights } from '../models/flightModel';

   export async function listFlights(req, res) {
     try {
       const flights = await getAllFlights();
       res.status(200).json(flights);
     } catch (error) {
       res.status(500).json({ error: 'Failed to fetch flights' });
     }
   }