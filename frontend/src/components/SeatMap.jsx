import React, { useState } from 'react';
import './SeatMap.css';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SEATS_PER_ROW = 14;

const SeatMap = ({ takenSeats, maxSelectable, selectedSeats, onSelectionChange }) => {
  const toggleSeat = (seatId) => {
    if (takenSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      onSelectionChange(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < maxSelectable) {
        onSelectionChange([...selectedSeats, seatId]);
      } else {
        // Optional: show a small toast or warning that max is reached
      }
    }
  };

  return (
    <div className="seat-map-container">
      <div className="screen-indicator">
        <div className="screen-curve"></div>
        <span>PANTALLA</span>
      </div>

      <div className="seats-grid">
        {ROWS.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats-in-row">
              {Array.from({ length: SEATS_PER_ROW }).map((_, idx) => {
                const seatNum = idx + 1;
                const seatId = `${row}${seatNum}`;
                const isTaken = takenSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                
                // Add a visual aisle in the middle
                const isAisle = seatNum === 7;

                return (
                  <React.Fragment key={seatId}>
                    <div 
                      className={`seat ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSeat(seatId)}
                      title={`Asiento ${seatId}`}
                    >
                      {seatNum}
                    </div>
                    {isAisle && <div className="aisle"></div>}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat"></div> <span>Disponible</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div> <span>Tu Selección</span>
        </div>
        <div className="legend-item">
          <div className="seat taken"></div> <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
