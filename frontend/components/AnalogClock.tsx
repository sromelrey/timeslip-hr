import { useState, useEffect } from "react";

interface AnalogClockProps {
  serverTime?: string;
}

const AnalogClock = ({ serverTime }: AnalogClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (serverTime) {
      setTime(new Date(serverTime));
    }
  }, [serverTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => new Date(prevTime.getTime() + 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  const hourMarks = Array.from({ length: 12 }, (_, i) => i);
  const minuteMarks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Clock face */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="hsl(var(--clock-face))"
            stroke="hsl(var(--clock-border))"
            strokeWidth="4"
          />
          
          {/* Inner decorative circle */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--clock-tick))"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Minute marks */}
          {minuteMarks.map((i) => {
            if (i % 5 !== 0) {
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const x1 = 100 + 85 * Math.cos(angle);
              const y1 = 100 + 85 * Math.sin(angle);
              const x2 = 100 + 80 * Math.cos(angle);
              const y2 = 100 + 80 * Math.sin(angle);
              return (
                <line
                  key={`min-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--clock-tick))"
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            }
            return null;
          })}

          {/* Hour marks */}
          {hourMarks.map((i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 100 + 85 * Math.cos(angle);
            const y1 = 100 + 85 * Math.sin(angle);
            const x2 = 100 + 72 * Math.cos(angle);
            const y2 = 100 + 72 * Math.sin(angle);
            return (
              <line
                key={`hour-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--clock-hour))"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Hour numbers */}
          {hourMarks.map((i) => {
            const hour = i === 0 ? 12 : i;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 100 + 60 * Math.cos(angle);
            const y = 100 + 60 * Math.sin(angle);
            return (
              <text
                key={`num-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground font-semibold text-sm"
                style={{ fontSize: "12px" }}
              >
                {hour}
              </text>
            );
          })}

          {/* Hour hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="55"
            stroke="hsl(var(--clock-hour))"
            strokeWidth="5"
            strokeLinecap="round"
            className="clock-hand"
            style={{ transform: `rotate(${hourDegrees}deg)`, transformOrigin: "100px 100px" }}
          />

          {/* Minute hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="hsl(var(--clock-minute))"
            strokeWidth="3"
            strokeLinecap="round"
            className="clock-hand"
            style={{ transform: `rotate(${minuteDegrees}deg)`, transformOrigin: "100px 100px" }}
          />

          {/* Second hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="28"
            stroke="hsl(var(--clock-second))"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="clock-hand"
            style={{ transform: `rotate(${secondDegrees}deg)`, transformOrigin: "100px 100px" }}
          />
          
          {/* Second hand tail */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="115"
            stroke="hsl(var(--clock-second))"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="clock-hand"
            style={{ transform: `rotate(${secondDegrees}deg)`, transformOrigin: "100px 100px" }}
          />

          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="6"
            fill="hsl(var(--clock-border))"
          />
          <circle
            cx="100"
            cy="100"
            r="3"
            fill="hsl(var(--clock-face))"
          />
        </svg>
      </div>
      
      {/* Digital time display */}
      <div className="font-mono text-2xl font-medium text-foreground tracking-wider">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

export default AnalogClock;
