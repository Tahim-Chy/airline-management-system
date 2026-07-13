import pool from '../lib/db';

   export async function getAllFlights() {
     const [rows] = await pool.query('SELECT * FROM flights');
     return rows;
   }