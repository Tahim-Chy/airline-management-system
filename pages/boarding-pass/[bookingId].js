import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function airportCode(cityName) {
  return cityName.slice(0, 3).toUpperCase();
}

export default function BoardingPassPage() {
  const router = useRouter();
  const { bookingId } = router.query;

  const [pass, setPass] = useState(null);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/boarding-pass/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPass(data);
      });
  }, [bookingId]);

  const handleEmail = async () => {
    setSending(true);
    setEmailStatus('');
    setPreviewUrl('');
    const res = await fetch('/api/boarding-pass/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
    const data = await res.json();
    setSending(false);
    if (res.ok) {
      setEmailStatus(`Sent to ${pass.passenger_email}!`);
      setPreviewUrl(data.preview_url);
    } else {
      setEmailStatus(data.error);
    }
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="container mt-4">
        <p>Loading boarding pass…</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <div className="boarding-pass">
        <div className="stub-main">
          <div className="airline-name">BRAC AIRLINE BOOKING SERVICE</div>
          <div className="route">
            <div className="airport">
              <div className="code">{airportCode(pass.origin)}</div>
              <div className="city">{pass.origin}</div>
            </div>
            <div className="plane-icon">✈</div>
            <div className="airport">
              <div className="code">{airportCode(pass.destination)}</div>
              <div className="city">{pass.destination}</div>
            </div>
          </div>

          <div className="details-grid">
            <div><span className="label">PASSENGER</span><span className="value">{pass.passenger_name}</span></div>
            <div><span className="label">FLIGHT</span><span className="value">{pass.flight_number}</span></div>
            <div><span className="label">SEAT</span><span className="value">{pass.seat_numbers}</span></div>
            <div><span className="label">BOARDING GROUP</span><span className="value">{pass.boarding_group}</span></div>
            <div><span className="label">DEPARTS</span><span className="value">{new Date(pass.departure_time).toLocaleString()}</span></div>
            <div><span className="label">MEAL</span><span className="value">{pass.meal_preference}</span></div>
          </div>
        </div>

        <div className="stub-divider">
          <div className="notch notch-top" />
          <div className="dashed-line" />
          <div className="notch notch-bottom" />
        </div>

        <div className="stub-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pass.qr_code} alt="Boarding pass QR code" className="qr-code" />
          <div className="stub-seat">SEAT {pass.seat_numbers}</div>
          <div className="stub-group">GROUP {pass.boarding_group}</div>
        </div>
      </div>

      <button className="btn btn-dark mt-4" onClick={handleEmail} disabled={sending}>
        {sending ? 'Sending…' : 'Email Me This Pass'}
      </button>
      {emailStatus && <p className="mt-2">{emailStatus}</p>}
      {previewUrl && (
        <a href={previewUrl} target="_blank" rel="noreferrer" className="small">
          View the sent email (test inbox preview) →
        </a>
      )}

      <style jsx>{`
        .boarding-pass {
          display: flex;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          max-width: 640px;
          color: #1a1a2e;
        }
        .stub-main {
          background: linear-gradient(135deg, #0b1f3a, #163a63);
          color: #fff;
          padding: 28px 26px;
          width: 420px;
        }
        .airline-name {
          font-size: 0.7rem;
          letter-spacing: 2px;
          opacity: 0.7;
          margin-bottom: 18px;
        }
        .route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .airport .code { font-size: 2rem; font-weight: 700; line-height: 1; }
        .airport .city { font-size: 0.75rem; opacity: 0.75; margin-top: 4px; }
        .plane-icon { font-size: 1.3rem; opacity: 0.6; transform: rotate(90deg); }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
        }
        .details-grid > div { display: flex; flex-direction: column; }
        .label { font-size: 0.62rem; letter-spacing: 1px; opacity: 0.6; }
        .value { font-size: 0.95rem; font-weight: 600; margin-top: 2px; }
        .stub-divider {
          position: relative;
          width: 0;
          background: #fff;
        }
        .notch {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #f5f6fa;
          left: -11px;
        }
        .notch-top { top: -11px; }
        .notch-bottom { bottom: -11px; }
        .dashed-line {
          position: absolute;
          top: 14px;
          bottom: 14px;
          left: -1px;
          border-left: 2px dashed #d7dbe3;
        }
        .stub-side {
          background: #f5f6fa;
          padding: 24px 20px;
          width: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .qr-code { width: 140px; height: 140px; }
        .stub-seat, .stub-group {
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
