import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Lightbulb,
  Construction,
  Trash2,
  Droplets,
  ShieldAlert,
} from "lucide-react";

import { Link } from "react-router-dom";

import ImageUploader from "../components/ImageUploader";
import LocationPicker from "../components/LocationPicker";
import AIAnalysisCard from "../components/AIAnalysisCard";

const categories = [
  {
    id: "roads",
    label: "Roads & Potholes",
    icon: Construction,
  },
  {
    id: "streetlights",
    label: "Street Lights",
    icon: Lightbulb,
  },
  {
    id: "garbage",
    label: "Garbage & Waste",
    icon: Trash2,
  },
  {
    id: "water",
    label: "Water & Drainage",
    icon: Droplets,
  },
  {
    id: "safety",
    label: "Public Safety",
    icon: ShieldAlert,
  },
];

function CreateComplaint() {
  // ================================
  // STATE
  // ================================

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  // ================================
  // FORM VALIDATION
  // ================================

  const canContinue =
    category !== "" &&
    description.trim().length >= 10 &&
    image !== null &&
    location !== null;

  // ================================
  // AI ANALYSIS
  // ================================

  const analyzeComplaint = async () => {
  setIsSubmitting(true);

  await new Promise((resolve) =>
    setTimeout(resolve, 1200)
  );

  const selectedCategory = categories.find(
    (item) => item.id === category
  );

  const mockAnalysis = {
    category:
      selectedCategory?.label || "Civic Issue",

    severity: "High",

    priority: "Urgent",

    duplicate: true,

    confidence: 94,
  };

  setAiAnalysis(mockAnalysis);

  setIsSubmitting(false);
};

  // ================================
  // SUBMIT COMPLAINT
  // ================================

  const submitComplaint = async () => {
  setIsSubmitting(true);

  try {
    // Temporary mock API request
    await new Promise((resolve) =>
      setTimeout(resolve, 1800)
    );

    const generatedId =
      `SVS-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    setComplaintId(generatedId);
    setSubmitted(true);

  } catch (error) {
    console.error("Complaint submission failed:", error);

    alert(
      "Unable to submit your complaint. Please try again."
    );

  } finally {
    setIsSubmitting(false);
  }
};

  // ================================
  // SUCCESS SCREEN
  // ================================

  if (submitted) {
    return (
      <div className="complaint-page">

        <header className="complaint-header">

          <Link
            to="/dashboard"
            className="complaint-back"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="complaint-brand">
            <strong>SevaSetu</strong>
            <span>Complaint submitted</span>
          </div>

        </header>

        <main className="success-page">

          <div className="success-icon">
            ✓
          </div>

          <span className="dashboard-eyebrow">
            Complaint Submitted
          </span>

          <h1>
            Thank you for reporting this issue.
          </h1>

          <p className="success-description">
            Your complaint has been successfully
            recorded. The concerned department will
            review it and take appropriate action.
          </p>

          <div className="complaint-id-card">

            <span>
              Complaint ID
            </span>

            <strong>
              {complaintId}
            </strong>

            <p>
              Save this ID to track your complaint.
            </p>

          </div>

          <div className="success-actions">

            <Link
              to="/my-complaints"
              className="primary-button"
            >
              Track Complaint
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/dashboard"
              className="secondary-button"
            >
              Back to Dashboard
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ================================
  // NORMAL COMPLAINT FORM
  // ================================

  return (
    <div className="complaint-page">

      {/* HEADER */}

      <header className="complaint-header">

        <Link
          to="/dashboard"
          className="complaint-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="complaint-brand">
          <strong>SevaSetu</strong>
          <span>Report a civic issue</span>
        </div>

      </header>


      {/* MAIN */}

      <main className="complaint-main">

        {/* PAGE HEADING */}

        <section className="complaint-heading">

          <span className="dashboard-eyebrow">
            Report an Issue
          </span>

          <h1>
            Help us understand the problem.
          </h1>

          <p>
            Provide a few details about the issue
            you've noticed. We'll use this information
            to route your complaint to the right
            department.
          </p>

        </section>


        {/* PROGRESS */}

        <div className="complaint-progress">

          <div className="progress-step active">
            <span>1</span>
            <strong>Details</strong>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>2</span>
            <strong>Photo</strong>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>3</span>
            <strong>Location</strong>
          </div>

          <div className="progress-line" />

          <div className="progress-step">
            <span>4</span>
            <strong>Review</strong>
          </div>

        </div>


        {/* FORM CARD */}

        <section className="complaint-form-card">

          {/* ISSUE DETAILS */}

          <div className="form-section-header">

            <div className="form-section-icon">
              <FileText size={20} />
            </div>

            <div>
              <h2>
                Issue details
              </h2>

              <p>
                Tell us what you observed.
              </p>
            </div>

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              What type of issue is this?
              <span>*</span>
            </label>

            <div className="category-grid">

              {categories.map((item) => {

                const Icon = item.icon;

                const selected =
                  category === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`category-option ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() =>
                      setCategory(item.id)
                    }
                  >

                    <Icon size={21} />

                    <span>
                      {item.label}
                    </span>

                    {selected && (
                      <span className="category-check">
                        ✓
                      </span>
                    )}

                  </button>
                );

              })}

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <div className="textarea-label-row">

              <label>
                Describe the problem
                <span>*</span>
              </label>

              <small>
                {description.length}/500
              </small>

            </div>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value.slice(
                    0,
                    500
                  )
                )
              }
              placeholder="Example: There is a large pothole near the main entrance of the college. It is difficult for vehicles to pass safely..."
              rows={6}
            />

            <p className="field-hint">
              Be specific. Mention what happened,
              where you noticed it, and anything that
              could help the authorities understand
              the issue.
            </p>

          </div>


          {/* PHOTO */}

          <div className="form-group">

            <div className="textarea-label-row">

              <label>
                Add a photo
                <span>*</span>
              </label>

            </div>

            <p className="field-hint photo-hint">
              A photo helps our system understand
              and prioritize the issue more accurately.
            </p>

            <ImageUploader
              onImageChange={setImage}
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <div className="textarea-label-row">

              <label>
                Location
                <span>*</span>
              </label>

            </div>

            <p className="field-hint photo-hint">
              Allow location access so we can identify
              where the issue needs attention.
            </p>

            <LocationPicker
              onLocationChange={setLocation}
            />
            {!canContinue && (
  <p className="form-validation-message">
    Please select a category, enter at least 10 characters,
    upload a photo, and capture your location before
    continuing.
  </p>
)}

          </div>


          {/* AI ANALYSIS */}

          {aiAnalysis && (
            <div className="form-group">

              <AIAnalysisCard
                analysis={aiAnalysis}
              />

            </div>
          )}


          {/* REVIEW */}

          {aiAnalysis && (
            <div className="review-section">

              <div className="review-header">

                <div className="review-icon">
                  <FileText size={18} />
                </div>

                <div>

                  <h2>
                    Review your complaint
                  </h2>

                  <p>
                    Check the information before
                    submitting.
                  </p>

                </div>

              </div>


              <div className="review-grid">

                {/* CATEGORY */}

                <div className="review-item">

                  <span>
                    Issue category
                  </span>

                  <strong>
                    {
                      categories.find(
                        (item) =>
                          item.id === category
                      )?.label
                    }
                  </strong>

                </div>


                {/* DESCRIPTION */}

                <div className="review-item review-item-full">

                  <span>
                    Description
                  </span>

                  <p>
                    {description}
                  </p>

                </div>


                {/* PHOTO */}

                <div className="review-item">

                  <span>
                    Photo
                  </span>

                  {image ? (
                    <div className="review-photo">

                      {image.previewUrl && (
                        <img
                          src={image.previewUrl}
                          alt="Complaint"
                        />
                      )}

                      <strong>
                        Photo attached
                      </strong>

                    </div>
                  ) : (
                    <strong>
                      No photo
                    </strong>
                  )}

                </div>


                {/* LOCATION */}

                <div className="review-item">

                  <span>
                    Location
                  </span>

                  {location ? (
                    <div className="review-location">

                      <strong>
                        Location captured
                      </strong>

                      {location.latitude !== undefined &&
                        location.longitude !== undefined && (
                          <small>
                            {location.latitude.toFixed(6)}
                            {" "}
                            ,
                            {" "}
                            {location.longitude.toFixed(6)}
                          </small>
                        )}

                    </div>
                  ) : (
                    <strong>
                      No location
                    </strong>
                  )}

                </div>

              </div>

            </div>
          )}


          {/* ACTION FOOTER */}

          <div className="complaint-form-footer">

  <Link
    to="/dashboard"
    className="secondary-button"
  >
    Cancel
  </Link>

  <button
    type="button"
    className="primary-button"
    disabled={!canContinue || isSubmitting}
    onClick={
      aiAnalysis
        ? submitComplaint
        : analyzeComplaint
    }
  >
    {isSubmitting
      ? aiAnalysis
        ? "Submitting..."
        : "Analyzing..."
      : aiAnalysis
        ? "Submit Complaint"
        : "Analyze Complaint"}

    {!isSubmitting && (
      <ArrowRight size={17} />
    )}
  </button>

</div>

        </section>


        {/* PRIVACY */}

        <div className="privacy-note">
          🔒 Your complaint information is securely
          submitted and used only for resolving
          civic issues.
        </div>

      </main>

    </div>
  );
}

export default CreateComplaint;