import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createTicket, getTicketsByFunction } from '../api/tickets';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';
import { Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const { functionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [ticketCount, setTicketCount] = useState(1);
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTakenSeats = async () => {
      try {
        const tickets = await getTicketsByFunction(functionId);
        setTakenSeats(tickets.map(t => t.seat_number));
      } catch (err) {
        console.error("Error fetching tickets", err);
      }
    };
    fetchTakenSeats();
  }, [functionId]);

  const handleNextStep = () => {
    if (step === 1 && ticketCount > 0) setStep(2);
    if (step === 2 && selectedSeats.length === ticketCount) setStep(3);
  };

  const handlePurchase = async () => {
    if (!user) {
      setError("Debes iniciar sesión para comprar boletos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Registrar un boleto por cada asiento seleccionado
      for (let seat of selectedSeats) {
        await createTicket({
          function_id: parseInt(functionId),
          customer_name: user.full_name,
          seat_number: seat,
          user_id: user.id
        });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al procesar tu compra. Es posible que alguien más haya ganado el asiento.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container booking-container fade-in">
        <div className="booking-card success-card">
          <CheckCircle2 size={80} color="var(--success)" />
          <h2>¡Compra Exitosa!</h2>
          <p>Tus boletos han sido reservados. Te esperamos en Cinépolis.</p>
          <p className="redirect-text">Redirigiendo a cartelera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container booking-container fade-in">
      <div className="booking-card">
        
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Boletos</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Asientos</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Pago</div>
        </div>

        {error && <div className="error-alert"><AlertCircle size={20}/> {error}</div>}

        {step === 1 && (
          <div className="step-content">
            <h2>Selecciona tus boletos</h2>
            <div className="ticket-selector">
              <div className="ticket-type">
                <span>Adulto ($80 MXN)</span>
                <div className="counter">
                  <button type="button" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}>-</button>
                  <span>{ticketCount}</span>
                  <button type="button" onClick={() => setTicketCount(ticketCount + 1)}>+</button>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleNextStep}>
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Elige tus lugares</h2>
            <p className="instruction">Selecciona {ticketCount} asiento(s).</p>
            <SeatMap 
              takenSeats={takenSeats} 
              maxSelectable={ticketCount}
              selectedSeats={selectedSeats}
              onSelectionChange={setSelectedSeats}
            />
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Atrás</button>
              <button 
                className="btn btn-primary" 
                onClick={handleNextStep}
                disabled={selectedSeats.length !== ticketCount}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content text-center">
            <h2>Confirmar Compra</h2>
            <div className="summary-box">
              <p><strong>Asientos:</strong> {selectedSeats.join(', ')}</p>
              <p><strong>Total a pagar:</strong> ${(ticketCount * 80).toFixed(2)} MXN</p>
            </div>
            
            {!user ? (
              <div className="login-prompt">
                <p>Para continuar con la compra necesitas iniciar sesión.</p>
                <Link to="/login" className="btn btn-secondary btn-block">Iniciar Sesión</Link>
              </div>
            ) : (
              <div className="payment-simulation">
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={handlePurchase} 
                  disabled={loading}
                >
                  {loading ? 'Procesando Pago...' : 'Pagar Ahora'}
                </button>
              </div>
            )}
            <button className="btn btn-secondary btn-block mt-3" onClick={() => setStep(2)}>
              Volver a Asientos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;
