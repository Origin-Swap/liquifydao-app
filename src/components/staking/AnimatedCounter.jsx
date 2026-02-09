import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, prefix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setDisplay(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <p className="text-xl font-semibold">
      {prefix}
      {display.toLocaleString()}
    </p>
  );
}
