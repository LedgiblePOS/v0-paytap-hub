
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface ImageUploadProps {
  onChange: (image: string | null) => void;
  value?: string | null;
  label?: string;
  className?: string;
  // Additional props needed by ProductForm
  existingImageUrl?: string;
  folder?: string;
  onUpload?: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onChange, 
  value, 
  label = "Upload Image",
  className = "",
  existingImageUrl,
  onUpload
}) => {
  // Use either value or existingImageUrl for the initial state
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || existingImageUrl || null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert file to base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      onChange(base64String);
      // Also call onUpload if provided (for backward compatibility)
      if (onUpload) {
        onUpload(base64String);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
    // Also call onUpload with null if provided
    if (onUpload) {
      onUpload('');
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <p className="text-sm font-medium">{label}</p>}
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Upload className="h-10 w-10 mb-2" />
            <p>{label}</p>
            <p className="text-xs">Click to browse</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
