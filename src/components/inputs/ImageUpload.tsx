import React, { useEffect, useRef } from "react";
import { TbPhotoPlus } from 'react-icons/tb';

// Extend the Window interface to include cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  // Ref to store the Cloudinary widget instance
  const cloudinaryWidgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.cloudinary) {
      // Initialize the Cloudinary widget
      cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onChange(result.info.secure_url);
          }
        }
      );
    }
  }, [onChange]);

  // Function to open the Cloudinary widget
  const handleOpenWidget = () => {
    if (cloudinaryWidgetRef.current) {
      cloudinaryWidgetRef.current.open();
    }
  };

  return (
    <div className='relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600'>
      {/* Button to trigger the Cloudinary widget */}
      <button onClick={handleOpenWidget} className="flex flex-col items-center">
        <TbPhotoPlus size={50} />
        <div className='font-semibold text-lg'>
          Click to upload
        </div>
      </button>
      {value && (
        <div className='absolute inset-0 w-full h-full'>
          <img alt="Upload" style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={value} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
