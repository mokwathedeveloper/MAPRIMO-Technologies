"use client";

import { useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  label: string;
  defaultValue?: string;
  onFileSelect: (file: File | null) => void;
}

export function ImageUpload({ label, defaultValue, onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors relative">
        {preview ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer w-full h-32">
            <ImageIcon className="h-10 w-12 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground font-medium">Click to upload image</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
}
