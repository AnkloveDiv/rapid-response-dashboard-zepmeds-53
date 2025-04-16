
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyToastProps {
  name: string;
  phone: string;
  location: string;
  onDispatch: () => void;
}

const EmergencyToast = ({ name, phone, location, onDispatch }: EmergencyToastProps) => {
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    const flashInterval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 500); // Flash every 500ms

    // Stop flashing after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(flashInterval);
      setIsFlashing(false);
    }, 10000);

    return () => {
      clearInterval(flashInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-lg",
      "border-2 border-red-500",
      "bg-red-50 dark:bg-red-900/20",
      isFlashing && "animate-pulse"
    )}>
      <div className="flex items-start gap-3">
        <BellRing className="h-5 w-5 text-red-500 animate-bounce" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-700 dark:text-red-300">
            Emergency Request
          </h4>
          <div className="mt-1 text-sm text-red-600 dark:text-red-200">
            <p><strong>Patient:</strong> {name}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Location:</strong> {location}</p>
          </div>
          <Button 
            variant="destructive"
            size="sm"
            className="mt-2 w-full"
            onClick={onDispatch}
          >
            Dispatch Ambulance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyToast;
