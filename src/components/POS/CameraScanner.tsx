
import React from 'react';
import { useCameraScanner } from '@/utils/barcode/useCameraScanner';
import { Button } from '@/components/ui/button';
import { RefreshCw, XCircle, Camera } from 'lucide-react';

interface CameraScannerProps {
  onDetect: (barcode: string) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onDetect, onClose }) => {
  const {
    videoRef,
    startScanning,
    stopScanning,
    isScanning,
    hasCamera,
    error
  } = useCameraScanner({
    onDetect,
    autoStart: true
  });
  
  return (
    <div className="flex flex-col items-center p-4 bg-background border rounded-lg">
      <div className="w-full relative mb-4">
        {hasCamera === false && (
          <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-lg">
            <XCircle className="h-12 w-12 text-destructive mb-2" />
            <p className="text-center text-sm">
              {error || "Camera not available"}
            </p>
          </div>
        )}
        
        {hasCamera === true && (
          <>
            <video 
              ref={videoRef}
              className="w-full h-48 bg-black object-cover rounded-lg"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-1 bg-primary/50"></div>
              <div className="h-48 w-1 bg-primary/50"></div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex space-x-2 mt-4">
        {isScanning ? (
          <Button variant="outline" onClick={stopScanning}>
            Pause Camera
          </Button>
        ) : (
          <Button onClick={startScanning}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}
        
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Position the barcode within the frame to scan
      </p>
    </div>
  );
};

export default CameraScanner;
