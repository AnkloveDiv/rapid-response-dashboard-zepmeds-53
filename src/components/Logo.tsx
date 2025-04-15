
import { Ambulance } from 'lucide-react';

interface LogoProps {
  size?: number;
  textSize?: string;
  className?: string;
}

export function Logo({ size = 32, textSize = "text-xl", className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-r from-purple-500 to-red-500 text-white p-2 rounded-full">
          <Ambulance size={size} className="text-white" />
        </div>
      </div>
      <div className={`font-bold ${textSize} bg-gradient-to-r from-purple-500 to-red-500 text-transparent bg-clip-text`}>
        Zepmeds
      </div>
    </div>
  );
}
