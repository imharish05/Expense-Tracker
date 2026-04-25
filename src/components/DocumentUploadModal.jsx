import React, { useState } from 'react';
import { Icon } from "@iconify/react";

const DocumentUploadModal = ({ onUpload, onClose, isUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    // Generate Previews for images
    const newPreviews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null; // For PDFs or other files
    });
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;
    onUpload(selectedFiles);
  };

  return (
    <div className="p-3">
      {/* Custom Upload Area */}
      <div 
        className="border-dashed border-2 radius-12 p-24 text-center bg-neutral-50 mb-16"
        style={{ cursor: 'pointer' }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input 
          id="fileInput" 
          type="file" 
          multiple 
          hidden 
          onChange={handleFileChange} 
          accept="image/*,.pdf"
        />
        <Icon icon="solar:cloud-upload-bold-duotone" width="48" className="text-primary-600 mb-8" />
        <p className="text-sm fw-bold mb-4">Click to select files</p>
        <p className="text-xs text-secondary-light">Images or PDFs (Max 10MB each)</p>
      </div>

      {/* Preview Grid */}
{/* Preview Grid */}
<div className="row g-3 max-h-300 overflow-y-auto mb-20 px-2">
  {selectedFiles.map((file, index) => (
    <div className="col-4" key={index}>
      {/* ✅ Outer wrapper — no overflow-hidden, button sits here */}
      <div className="position-relative border radius-8 bg-white shadow-sm h-100">
        
        {/* ✅ Close button on outer wrapper, not clipped */}
        <button 
          onClick={() => removeFile(index)}
          className="position-absolute btn btn-danger-600 p-0 d-flex align-items-center justify-content-center radius-circle"
          style={{ 
            width: '20px', 
            height: '20px', 
            zIndex: 5,
            top: '-8px',    // ✅ sits above the card
            right: '-8px'   // ✅ sits outside the card edge
          }}
        >
          <Icon icon="ic:round-close" width="14" />
        </button>

        {/* ✅ Image container has overflow-hidden separately */}
        <div 
          className="overflow-hidden radius-8"
          style={{ height: '80px' }}
        >
          {previews[index] ? (
            <img src={previews[index]} alt="preview" className="w-100 h-100 object-fit-cover" />
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-neutral-100 h-100">
              <Icon icon="solar:document-bold-duotone" width="32" className="text-secondary-light" />
            </div>
          )}
        </div>

        <div className="p-4 bg-white">
          <p className="text-xxs fw-bold text-truncate mb-0">{file.name}</p>
        </div>
      </div>
    </div>
  ))}
</div>

      <div className="d-flex gap-2 justify-content-end">
        <button className="btn btn-neutral-200 text-neutral-600 btn-sm px-24" onClick={onClose}>Cancel</button>
        <button 
          className="btn btn-primary-600 btn-sm px-24 d-flex align-items-center gap-2" 
          disabled={selectedFiles.length === 0 || isUploading}
          onClick={handleSubmit}
        >
          {isUploading ? 'Uploading...' : 'Upload Now'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadModal;