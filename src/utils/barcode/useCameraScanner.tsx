
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScanResult } from './types';

interface UseCameraScannerOptions {
  onDetect: (barcode: string) => void;
  autoStart?: boolean;
}

interface UseCameraScannerReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  isScanning: boolean;
  hasCamera: boolean | null;
  error: string | null;
}

/**
 * Hook to use camera-based barcode scanning
 */
export const useCameraScanner = ({ 
  onDetect,
  autoStart = false 
}: UseCameraScannerOptions): UseCameraScannerReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check camera availability on mount
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const result = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);
        result.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Camera not available:', err);
        setHasCamera(false);
        setError('Camera access denied or not available');
      }
    };
    
    checkCamera();
  }, []);
  
  // Start the camera and scanning
  const startScanning = useCallback(async () => {
    if (!hasCamera || isScanning || !videoRef.current) return;
    
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      // In a real implementation, we would use a barcode detection library here
      // For example, QuaggaJS or ZXing libraries
      // This is a placeholder for demonstration purposes
      setIsScanning(true);
      
      console.log('Camera-based barcode scanning started');
    } catch (err) {
      console.error('Error starting camera scanner:', err);
      setError('Failed to start camera scanner');
    }
  }, [hasCamera, isScanning]);
  
  // Stop scanning and release camera
  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsScanning(false);
    console.log('Camera-based barcode scanning stopped');
  }, []);
  
  // Auto-start if configured
  useEffect(() => {
    if (autoStart && hasCamera && !isScanning) {
      startScanning();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [autoStart, hasCamera, isScanning, startScanning]);
  
  return {
    videoRef,
    startScanning,
    stopScanning,
    isScanning,
    hasCamera,
    error
  };
};
