import React, { useContext, useEffect, useState } from "react";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import toast from "react-hot-toast";

const AIRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }
    api.get("/job/recommendations")
      .then((res) => {
        setJobs(res.data.jobs || []);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMsg(
          error.response?.data?.message || "Could not load recommendations."
        );
        toast.error(
          error.response?.data?.message || "Could not load recommendations."
        );
        setLoading(false);
      });
  }, [isAuthorized]);

  const scoreColor = (score) => {
    if (score >= 60) return "#1f9d55"; // green
    if (score >= 30) return "#e0a800"; // amber
    return "#d64545"; // red
  };

  return (
    <section className="jobs page">
      <div className="container">
        <h1>AI RECOMMENDED JOBS FOR YOU</h1>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Ranked using an NLP TF-IDF + Cosine Similarity model comparing your
          skills profile against every open job description.
        </p>

        {loading && <p style={{ textAlign: "center" }}>Analyzing jobs with AI...</p>}

        {!loading && errorMsg && (
          <p style={{ textAlign: "center", color: "#d64545" }}>{errorMsg}</p>
        )}

        {!loading && !errorMsg && jobs.length === 0 && (
          <p style={{ textAlign: "center" }}>No open jobs found right now.</p>
        )}

        <div className="banner">
          {jobs.map((job) => (
            <div className="card" key={job._id}>
              <p style={{ fontWeight: "bold" }}>{job.title}</p>
              <p>{job.category}</p>
              <p>{job.country}</p>
              <p
                style={{
                  fontWeight: "bold",
                  color: scoreColor(job.matchScore),
                }}
              >
                AI Match: {job.matchScore}%
              </p>
              <Link to={`/job/${job._id}`}>Job Details</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
