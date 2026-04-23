import React, { useState } from "react";
import "../style/home.scss";
import { FaFileAlt, FaUser, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { generateInterviewReport } from "../services/interview.api";

const Home = () => {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError("");
    } else {
      setError("Please upload a valid PDF file");
      setResume(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!jobDescription.trim()) {
      setError("Job description is required");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      setError("Either resume or self-description is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("selfDescription", selfDescription);
      if (resume) {
        formData.append("resume", resume);
      }

      // Call API
      const response = await generateInterviewReport(formData);

      // Navigate to interview page with report ID
navigate(`/interview/${response.interviewReport._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview report");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home">
      {/* HEADER */}
      <div className="header-section">
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </div>

      {/* MAIN CARD */}
      <form className="interview-input-group" onSubmit={handleSubmit}>
        {/* LEFT */}
        <div className="left">
          <div className="section-header">
            <span>
              <FaFileAlt className="icon" />
              Target Job Description
            </span>
            <span className="tag">REQUIRED</span>
          </div>

          <textarea
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            maxLength={5000}
          />
          <p className="char-count">{jobDescription.length} / 5000 chars</p>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="section-header">
            <span>
              <FaUser className="icon" />
              Your Profile
            </span>
            <span className="tag pink">BEST RESULTS</span>
          </div>

          {/* UPLOAD BOX */}
          <label htmlFor="resume" className="upload-box">
            <FaUpload className="upload-icon" />

            <p className="upload-text">
              Click to upload or drag & drop
            </p>

            <span className="upload-subtext">
              PDF (Max 5MB)
            </span>

            <input
              hidden
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>

          {resume && (
            <div className="file-selected">
              ✓ {resume.name}
            </div>
          )}

          <div className="divider">OR</div>

          {/* SELF DESCRIPTION */}
          <div className="input-group">
            <label>Quick Self-Description</label>
            <textarea
              placeholder="Describe your experience, skills, projects..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              maxLength={2000}
            />
          </div>

          <div className="info-box">
            Either a Resume or a Self Description is required to generate a personalized plan.
          </div>

          {error && <div className="error-box">{error}</div>}

          {/* BUTTON */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "⏳ Generating..." : "✨ Generate My Interview Strategy"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Home;