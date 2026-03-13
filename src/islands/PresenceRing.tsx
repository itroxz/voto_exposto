import { useEffect, useRef } from 'react';

interface Props {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export default function PresenceRing({ percent, size = 64, strokeWidth = 8 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  const getColor = (p: number) => {
    if (p >= 85) return 'var(--vote-yes)';
    if (p >= 70) return 'var(--vote-obstruction)';
    return 'var(--vote-no)';
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-tertiary)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getColor(percent)}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 800,
          fontSize: `${size * 0.18}px`,
          fill: 'var(--text-primary)',
        }}
      >
        {percent}%
      </text>
    </svg>
  );
}
