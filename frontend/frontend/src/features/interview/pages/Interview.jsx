import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useParams } from "react-router-dom";
import { getInterviewReportById } from "../services/interview.api";

const Interview = () => {
  const { interviewId } = useParams();
  const [activeNav, setActiveNav] = useState("roadmap");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getInterviewReportById(interviewId);
setReport(data.interviewReport);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load interview report");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>⏳ Loading your interview plan...</h1>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="loading-screen">
        <h1>❌ {error || "Interview report not found"}</h1>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80 ? "score--high" :
      report.matchScore >= 60 ? "score--mid" : "score--low";

  return (
    <div className="interview-page">
      {/* LEFT NAV */}
      <aside className="nav">
        <p className="nav-title">SECTIONS</p>

        <button
          className={`nav-item ${activeNav === "technical" ? "active" : ""}`}
          onClick={() => setActiveNav("technical")}
        >
          Technical Questions
        </button>
        <button
          className={`nav-item ${activeNav === "behavioral" ? "active" : ""}`}
          onClick={() => setActiveNav("behavioral")}
        >
          Behavioral Questions
        </button>
        <button
          className={`nav-item ${activeNav === "roadmap" ? "active" : ""}`}
          onClick={() => setActiveNav("roadmap")}
        >
          Road Map
        </button>
      </aside>

      {/* CENTER CONTENT */}
      <main className="content">
        {activeNav === "technical" && (
          <section>
            <div className="content-header">
              <h2>Technical Questions</h2>
              <span className="content-count">{report.technicalQuestions?.length || 0} questions</span>
            </div>
            <div className="questions-list">
              {report.technicalQuestions?.map((q, i) => (
                <div key={i} className="question-card">
                  <div className="question-header">
                    <span className="q-number">Q{i + 1}</span>
                    <h3>{q.question}</h3>
                  </div>
                  <div className="question-body">
                    <div className="answer-section">
                      <h4>💡 Intention</h4>
                      <p>{q.intention}</p>
                    </div>
                    <div className="answer-section">
                      <h4>✅ Model Answer</h4>
                      <p>{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeNav === "behavioral" && (
          <section>
            <div className="content-header">
              <h2>Behavioral Questions</h2>
              <span className="content-count">{report.behavioralQuestions?.length || 0} questions</span>
            </div>
            <div className="questions-list">
              {report.behavioralQuestions?.map((q, i) => (
                <div key={i} className="question-card">
                  <div className="question-header">
                    <span className="q-number">Q{i + 1}</span>
                    <h3>{q.question}</h3>
                  </div>
                  <div className="question-body">
                    <div className="answer-section">
                      <h4>💡 Intention</h4>
                      <p>{q.intention}</p>
                    </div>
                    <div className="answer-section">
                      <h4>✅ Model Answer</h4>
                      <p>{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeNav === "roadmap" && (
          <section>
            <div className="content-header">
              <h2>Preparation Road Map</h2>
              <span className="content-count">{report.preparationPlan?.length || 0}-day plan</span>
            </div>

            <div className="timeline">
              {report.preparationPlan?.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />

                  <div className="timeline-content">
                    <div className="day-title">
                      <span className="day">Day {item.day}</span>
                      <h3>{item.focus}</h3>
                    </div>

                    <ul className="points-list">
                      {item.tasks?.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="sidebar">
        <div className="score-box">
          <p className="score-title">MATCH SCORE</p>
          <div className={`circle ${scoreColor}`}>{report.matchScore}%</div>
          <span className="score-text">
            {report.matchScore >= 80
              ? "Strong match for this role"
              : report.matchScore >= 60
                ? "Good match for this role"
                : "Needs improvement"}
          </span>
        </div>

        <div className="skills-box">
          <p className="skills-title">SKILL GAPS</p>

          <div className="tags-container">
            {report.skillGaps?.map((gap, i) => {
              let tagClass = "tag-red";
              if (gap.severity === "low") tagClass = "tag-green";
              else if (gap.severity === "medium") tagClass = "tag-yellow";

              return (
                <span key={i} className={`tag ${tagClass}`}>
                  {gap.skill}
                  <span className="severity-badge">{gap.severity}</span>
                </span>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Interview;