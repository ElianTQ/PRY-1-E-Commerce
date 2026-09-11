import { useState, useEffect, useRef } from 'react';
import { useRange } from 'react-instantsearch';

const formatCRC = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const MIN_GAP = 5000;

const PriceSlider = ({ attribute }) => {
  const { range, start, refine, canRefine } = useRange({ attribute });
  const { min, max } = range;

  const totalRange = (max ?? 0) - (min ?? 0);
  const effectiveGap = Math.min(MIN_GAP, Math.max(totalRange, 0));

  const currentMin = Number.isFinite(start[0]) ? start[0] : min;
  const currentMax = Number.isFinite(start[1]) ? start[1] : max;

  const [values, setValues] = useState([currentMin ?? 0, currentMax ?? 0]);

  // Sincroniza solo cuando Algolia cambia el filtro desde fuera,
  // no en cada cambio local del thumb.
  const startKey = `${currentMin}-${currentMax}`;
  const lastKeyRef = useRef(startKey);

  useEffect(() => {
    if (lastKeyRef.current !== startKey) {
      lastKeyRef.current = startKey;
      setValues([currentMin ?? 0, currentMax ?? 0]);
    }
  }, [startKey, currentMin, currentMax]);

  if (!canRefine || min === max) return null;

  const handleMinChange = (e) => {
    const raw = Number(e.target.value);
    const newMin = Math.min(raw, values[1] - effectiveGap);
    setValues([newMin, values[1]]);
  };

  const handleMaxChange = (e) => {
    const raw = Number(e.target.value);
    const newMax = Math.max(raw, values[0] + effectiveGap);
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
          step={100}
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
          step={100}
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