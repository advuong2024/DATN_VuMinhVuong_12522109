import { useState, useEffect, useRef } from "react";

function parseValue(str) {
  const match = str.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: Number(match[1]), suffix: match[2] };
}

export default function AnimatedCounter({ value, duration = 2000 }) {
  const { num: target, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let rafId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
