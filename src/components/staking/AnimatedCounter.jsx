import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, prefix = "", decimals = 6 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const steps = 60; // frames
    const increment = value / steps;
    let currentStep = 0;

    const counter = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplay(value);
        clearInterval(counter);
      } else {
        setDisplay(start + increment * currentStep);
      }
    }, duration / steps);

    return () => clearInterval(counter);
  }, [value]);

  // Format dengan desimal yang tepat
  const formatDisplay = () => {
    if (typeof display !== 'number') return '0';

    // Untuk angka kecil seperti 0.002, tampilkan dengan desimal yang cukup
    if (display < 0.01) {
      return display.toFixed(6); // Tampilkan 6 desimal untuk angka kecil
    } else if (display < 1) {
      return display.toFixed(4); // Tampilkan 4 desimal untuk 0.xxxx
    } else {
      return display.toFixed(2); // Tampilkan 2 desimal untuk angka besar
    }
  };

  return (
    <span className="text-xl font-semibold">
      {prefix}
      {formatDisplay()}
    </span>
  );
}
