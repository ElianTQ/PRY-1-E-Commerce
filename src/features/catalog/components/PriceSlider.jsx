import { useState, useEffect } from 'react';
import { useRange } from 'react-instantsearch';

const formatCRC = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const PriceSlider = ({ attribute }) => {
  const { range, start, refine, canRefine } = useRange({ attribute });
  const { min, max } = range;

  const currentMin = Number.isFinite(start[0]) ? start[0] : min;
  const currentMax = Number.isFinite(start[1]) ? start[1] : max;

  const [values, setValues] = useState([currentMin ?? 0, currentMax ?? 0]);

  useEffect(() => {
    setValues([currentMin ?? 0, currentMax ?? 0]);
  }, [currentMin, currentMax]);

  if (!canRefine || min === max) return null;

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), values[1] - 1);
    setValues([newMin, values[1]]);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), values[0] + 1);
    setValues([values[0], newMax]);
  };

  const handleCommit = () => {
    refine([values[0], values[1]]);
  };

  const minPercent = ((values[0] - min) / (max - min)) * 100;
  const maxPercent = ((values[1] - min) / (max - min)) * 100;

  return (
    <div className="price-slider-container">
      <div className="price-slider">
        <div className="price-track-bg" />
        <div
          className="price-track"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={values[0]}
          onChange={handleMinChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="price-thumb price-thumb-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={values[1]}
          onChange={handleMaxChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="price-thumb price-thumb-max"
        />
      </div>
      <div className="price-values">
        <span className="price-min">{formatCRC(values[0])}</span>
        <span className="price-max">{formatCRC(values[1])}</span>
      </div>
    </div>
  );
};

export default PriceSlider;