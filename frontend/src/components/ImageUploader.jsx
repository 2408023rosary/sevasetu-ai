import { useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  X,
  CheckCircle2,
} from "lucide-react";

function ImageUploader({ onImageChange }) {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    const imageData = {
      file,
      previewUrl,
    };

    setImage(imageData);

    if (onImageChange) {
      onImageChange(imageData);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);
  };

  const handleRemove = () => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }

    setImage(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className="image-uploader">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        hidden
      />

      {!image ? (
        <button
          type="button"
          className="image-upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="image-upload-icon">
            <ImagePlus size={25} />
          </div>

          <strong>
            Upload a photo of the issue
          </strong>

          <span>
            Add a clear photo to help us understand
            the problem better.
          </span>

          <div className="image-upload-button">
            <Camera size={16} />
            Choose Photo
          </div>

          <small>
            JPG, PNG or WebP · Maximum 5 MB
          </small>
        </button>
      ) : (
        <div className="image-preview-container">

          <img
            src={image.previewUrl}
            alt="Complaint preview"
            className="image-preview"
          />

          <div className="image-preview-overlay">
            <div className="image-success">
              <CheckCircle2 size={17} />
              Photo added
            </div>

            <button
              type="button"
              className="remove-image-button"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
          </div>

          <div className="image-file-info">
            <strong>{image.file.name}</strong>

            <span>
              {(image.file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

        </div>
      )}

      {error && (
        <p className="image-upload-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default ImageUploader;