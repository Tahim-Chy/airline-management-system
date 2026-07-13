import { useEffect, useState } from 'react';

   export default function FlightsPage() {
     const [flights, setFlights] = useState([]);

     useEffect(() => {
       fetch('/api/flights')
         .then((res) => res.json())
         .then((data) => setFlights(data));
     }, []);

     return (
       <div className="container mt-4">
         <h1>Flights</h1>
         <table className="table table-striped">
           <thead>
             <tr><th>Flight No.</th><th>From</th><th>To</th><th>Status</th></tr>
           </thead>
           <tbody>
             {flights.map((f) => (
               <tr key={f.id}>
                 <td>{f.flight_number}</td>
                 <td>{f.origin}</td>
                 <td>{f.destination}</td>
                 <td>{f.status}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }