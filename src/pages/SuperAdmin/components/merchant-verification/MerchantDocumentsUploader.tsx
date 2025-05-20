
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileImage, FileX, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentUploaderProps {
  merchantId: string;
  onUploadComplete: (url: string, fileName: string) => void;
  documentType: string;
}

const MerchantDocumentsUploader: React.FC<DocumentUploaderProps> = ({
  merchantId,
  onUploadComplete,
  documentType
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file path in the 'verification-documents' bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${merchantId}/${documentType}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(data?.path || fileName);

      const publicUrl = publicUrlData.publicUrl;

      toast({
        title: "Upload successful",
        description: "Document uploaded successfully",
      });

      onUploadComplete(publicUrl, file.name);
      setFile(null);
      setPreview(null);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="document-upload">Upload {documentType.replace('_', ' ')}</Label>
        <Input 
          id="document-upload" 
          type="file" 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          Accepted file types: PDF, JPG, JPEG, PNG (max 5MB)
        </p>
      </div>

      {preview && (
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="relative h-40 flex items-center justify-center bg-gray-50">
              <img 
                src={preview} 
                alt="File preview" 
                className="max-h-40 max-w-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {file && !preview && (
        <Card className="overflow-hidden">
          <CardContent className="p-4 flex items-center gap-2">
            <FileImage className="h-8 w-8 text-blue-500" />
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        {file && (
          <Button variant="outline" onClick={clearFile} disabled={isUploading}>
            <FileX className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MerchantDocumentsUploader;
