
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ReceiptData } from '@/utils/receiptUtils';
import ReceiptPreview from './ReceiptPreview';

interface ReceiptTemplate {
  name: string;
  showLogo: boolean;
  headerText: string;
  footerText: string;
  showMerchantId: boolean;
  showItemSku: boolean;
  showTaxBreakdown: boolean;
  includeCustomerInfo: boolean;
  thankYouMessage: string;
}

/**
 * Component for merchants to customize receipt templates
 */
const ReceiptTemplateEditor: React.FC = () => {
  const [template, setTemplate] = useState<ReceiptTemplate>({
    name: 'Default Template',
    showLogo: true,
    headerText: 'Thank you for shopping with us!',
    footerText: 'Please come again!',
    showMerchantId: true,
    showItemSku: false,
    showTaxBreakdown: true,
    includeCustomerInfo: false,
    thankYouMessage: 'Thank you for your business!',
  });
  
  const [showPreview, setShowPreview] = useState(false);
  
  // Update template field values
  const updateField = (field: keyof ReceiptTemplate, value: any) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Sample receipt data for preview
  const sampleReceiptData: ReceiptData = {
    merchantName: "Sample Business Name",
    merchantId: "merchant-123",
    transactionId: "tx-" + Math.floor(Math.random() * 10000),
    date: new Date().toLocaleString(),
    items: [
      { id: "1", name: "Sample Product 1", price: 19.99, quantity: 2 },
      { id: "2", name: "Sample Product 2", price: 7.50, quantity: 1 },
    ],
    subtotal: 47.48,
    discountAmount: 5.00,
    total: 42.48,
    paymentMethod: "Credit Card",
    taxAmount: 3.40,
    taxRate: 7,
    notes: template.thankYouMessage,
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Template Settings</CardTitle>
          <CardDescription>Customize how your receipts look and what information they include</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input 
              id="template-name" 
              value={template.name} 
              onChange={e => updateField('name', e.target.value)} 
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Header Settings</h3>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-logo"
                  checked={template.showLogo}
                  onCheckedChange={value => updateField('showLogo', value)}
                />
                <Label htmlFor="show-logo">Show Logo</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="header-text">Header Text</Label>
                <Textarea 
                  id="header-text" 
                  value={template.headerText} 
                  onChange={e => updateField('headerText', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Footer Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="thank-you-message">Thank You Message</Label>
                <Input 
                  id="thank-you-message" 
                  value={template.thankYouMessage} 
                  onChange={e => updateField('thankYouMessage', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Textarea 
                  id="footer-text" 
                  value={template.footerText} 
                  onChange={e => updateField('footerText', e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Content Options</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-merchant-id"
                  checked={template.showMerchantId}
                  onCheckedChange={value => updateField('showMerchantId', value === true)}
                />
                <Label htmlFor="show-merchant-id">Show Merchant ID</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-item-sku"
                  checked={template.showItemSku}
                  onCheckedChange={value => updateField('showItemSku', value === true)}
                />
                <Label htmlFor="show-item-sku">Show Item SKUs</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-tax-breakdown"
                  checked={template.showTaxBreakdown}
                  onCheckedChange={value => updateField('showTaxBreakdown', value === true)}
                />
                <Label htmlFor="show-tax-breakdown">Show Tax Breakdown</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-customer-info"
                  checked={template.includeCustomerInfo}
                  onCheckedChange={value => updateField('includeCustomerInfo', value === true)}
                />
                <Label htmlFor="include-customer-info">Include Customer Info</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline">Reset to Default</Button>
            <Button onClick={() => setShowPreview(true)}>Preview Receipt</Button>
          </div>
        </CardContent>
      </Card>
      
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-auto max-h-[90vh] max-w-md w-full">
            <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center">
              <h3 className="font-semibold">Receipt Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>Close</Button>
            </div>
            <div className="p-4">
              <ReceiptPreview receiptData={{
                ...sampleReceiptData,
                notes: template.thankYouMessage
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptTemplateEditor;
