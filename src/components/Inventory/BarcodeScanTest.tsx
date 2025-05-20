
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Scan, BarcodeIcon } from 'lucide-react';
import { useBarcodeScanner } from '@/utils/barcode/useBarcodeScanner';
import { ScanResult } from '@/utils/barcode/types';

const BarcodeScanTest: React.FC = () => {
  const [testBarcode, setTestBarcode] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  
  const { isEnabled, enableScanner, disableScanner, simulateScan } = useBarcodeScanner({
    onScan: (result) => {
      setScanHistory(prev => [result, ...prev].slice(0, 5));
    }
  });
  
  const handleSimulateScan = () => {
    if (!testBarcode.trim()) return;
    simulateScan(testBarcode.trim());
    setTestBarcode('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarcodeIcon className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={isEnabled ? "default" : "outline"}
              className={isEnabled ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={isEnabled ? disableScanner : enableScanner}
            >
              {isEnabled ? "Scanner Active" : "Scanner Inactive"}
            </Button>
            
            {isEnabled && <ScanLine className="h-5 w-5 text-green-500 animate-pulse" />}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Test barcode value..."
              value={testBarcode}
              onChange={(e) => setTestBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSimulateScan();
                }
              }}
            />
            <Button onClick={handleSimulateScan} className="whitespace-nowrap">
              <Scan className="mr-2 h-4 w-4" />
              Simulate Scan
            </Button>
          </div>
          
          {scanHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Scans</h3>
              <ul className="space-y-2">
                {scanHistory.map((scan, index) => (
                  <li key={index} className="text-sm bg-muted px-3 py-2 rounded-md">
                    <div className="font-mono">{scan.barcode}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanTest;
