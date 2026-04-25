import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports } from "../services/interview.api";
import "../style/history.scss";

const History = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getMyReports();
        setReports(data.reports || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <main className="history-page loading-screen">
        <h1>⏳ Loading your history...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="history-page error-screen">
        <h1>❌ {error}</h1>
      </main>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <header className="history-header">
          <h2>Your Interview History</h2>
          <p>Review your past AI mock interviews and track your progress.</p>
        </header>

        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No interview history yet</h3>
            <p>Generate an interview report to see your history here.</p>
            <button className="create-btn" onClick={() => navigate("/")}>
              Start New Interview
            </button>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => {
              const scoreColor =
                report.matchScore >= 80 ? "score-high" :
                report.matchScore >= 60 ? "score-mid" : "score-low";

              return (
                <div key={report._id} className="report-card">
                  <div className="card-header">
                    <span className="date">{formatDate(report.createdAt)}</span>
                    <div className={`score-badge ${scoreColor}`}>
                      {report.matchScore}% Match
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h4>Job Description</h4>
                    <p>{truncateText(report.jobDescription)}</p>
                  </div>
                  
                  <div className="card-footer">
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/interview/${report._id}`)}
                    >
                      View Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
