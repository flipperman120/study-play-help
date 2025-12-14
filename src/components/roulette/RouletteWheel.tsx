import { cn } from '@/lib/utils';

interface RouletteWheelProps {
  spinning: boolean;
  result: number | null;
}

// European roulette wheel order
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(num) ? 'red' : 'black';
};

const RouletteWheel = ({ spinning, result }: RouletteWheelProps) => {
  const segmentAngle = 360 / 37;
  
  // Calculate rotation to land on result
  const resultIndex = result !== null ? WHEEL_NUMBERS.indexOf(result) : 0;
  const targetAngle = resultIndex * segmentAngle;
  
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-8 border-casino-wood shadow-2xl" />
      
      {/* Wheel */}
      <div
        className={cn(
          'absolute inset-2 rounded-full overflow-hidden transition-transform',
          spinning ? 'animate-[spin_0.1s_linear_infinite]' : 'transition-transform duration-[3s] ease-out'
        )}
        style={{
          transform: !spinning && result !== null ? `rotate(${360 * 5 + targetAngle}deg)` : undefined,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {WHEEL_NUMBERS.map((num, i) => {
            const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
            const x1 = 50 + 50 * Math.cos(startAngle);
            const y1 = 50 + 50 * Math.sin(startAngle);
            const x2 = 50 + 50 * Math.cos(endAngle);
            const y2 = 50 + 50 * Math.sin(endAngle);
            
            const color = getNumberColor(num);
            const fill = color === 'green' ? '#059669' : color === 'red' ? '#dc2626' : '#1a1a1a';
            
            const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
            const textX = 50 + 38 * Math.cos(midAngle);
            const textY = 50 + 38 * Math.sin(midAngle);
            const textRotation = (i + 0.5) * segmentAngle;
            
            return (
              <g key={num}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={fill}
                  stroke="#d4af37"
                  strokeWidth="0.3"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                >
                  {num}
                </text>
              </g>
            );
          })}
          {/* Center */}
          <circle cx="50" cy="50" r="12" fill="#2a2a2a" stroke="#d4af37" strokeWidth="1" />
          <circle cx="50" cy="50" r="8" fill="#1a1a1a" stroke="#d4af37" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Ball indicator (top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <div className="w-4 h-4 rounded-full bg-foreground shadow-lg border-2 border-primary" />
      </div>
      
      {/* Result display */}
      {result !== null && !spinning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-foreground shadow-lg animate-scale-in',
              getNumberColor(result) === 'green' && 'bg-casino-green',
              getNumberColor(result) === 'red' && 'bg-casino-red',
              getNumberColor(result) === 'black' && 'bg-background border-2 border-primary'
            )}
          >
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouletteWheel;
