import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, BriefcaseBusiness, Users, Building2, RefreshCw } from "lucide-react";
import JobForm from "./components/JobForm.jsx";
import JobList from "./components/JobList.jsx";
import { getJobs, createJob, updateJob, deleteJob } from "./services/jobService.js";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(`${e.message}. Check that Spring Boot is running at localhost:8080 and MySQL is connected.`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return jobs;
    return jobs.filter(job =>
      [job.title, job.company, job.location, job.jobType, job.description]
        .some(value => value?.toLowerCase().includes(term))
    );
  }, [jobs, search]);

  async function saveJob(job) {
    if (editingJob) {
      await updateJob(editingJob.id, job);
      setEditingJob(null); setNotice("Job listing updated successfully.");
    } else {
      await createJob(job); setNotice("Job published successfully.");
    }
    await loadJobs();
  }

  async function removeJob(id) {
    if (!window.confirm("Delete this job listing? This cannot be undone.")) return;
    setDeletingId(id); setError(""); setNotice("");
    try {
      await deleteJob(id);
      if (editingJob?.id === id) setEditingJob(null);
      setNotice("Job listing deleted.");
      await loadJobs();
    } catch (e) { setError(e.message || "Unable to delete job."); }
    finally { setDeletingId(null); }
  }

  return <div className="app-shell">
    <nav className="navbar">
      <a className="brand" href="#"><span className="brand-mark"><BriefcaseBusiness size={20} /></span> JobConnect</a>
      <div className="nav-right"><span className="nav-label">CAREERS START HERE</span><a className="nav-post" href="#post-job">Post a job <span>↗</span></a></div>
    </nav>

    <header className="hero">
      <div className="hero-content">
        <p className="eyebrow light">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>Find work that<br /><span>moves you forward.</span></h1>
        <p className="hero-copy">Discover opportunities, explore companies, and take the next step in your career.</p>
        <div className="hero-search"><Search size={20} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, company, skill or location" aria-label="Search jobs" />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search">Clear</button>}
        </div>
        <p className="hero-hint">Search across job titles, companies, locations and descriptions.</p>
      </div>
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
    </header>

    <main className="main-content">
      <section className="stats-row">
        <div className="stat-card"><span className="stat-icon"><BriefcaseBusiness size={19} /></span><div><strong>{jobs.length}</strong><span>Listed jobs</span></div></div>
        <div className="stat-card"><span className="stat-icon"><Building2 size={19} /></span><div><strong>{new Set(jobs.map(j => j.company)).size}</strong><span>Companies</span></div></div>
        <div className="stat-card"><span className="stat-icon"><Users size={19} /></span><div><strong>Open</strong><span>Career possibilities</span></div></div>
      </section>

      {notice && <div className="success-message" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
      {error && <div className="error-banner" role="alert"><div><strong>Could not load or update jobs</strong><p>{error}</p></div><button className="button secondary" onClick={loadJobs}><RefreshCw size={15} /> Retry</button></div>}

      <section className="list-section">
        <div className="section-heading"><div><p className="eyebrow">EXPLORE OPPORTUNITIES</p><h2>Latest job openings <span className="count-pill">{filteredJobs.length}</span></h2></div>
          <button className="button secondary refresh-button" onClick={loadJobs}><RefreshCw size={15} /> Refresh</button>
        </div>
        {loading ? <div className="loading-state">Loading opportunities...</div> :
          <JobList jobs={filteredJobs} onEdit={setEditingJob} onDelete={removeJob} deletingId={deletingId} />}
      </section>

      <section id="post-job" className="post-section">
        <JobForm editingJob={editingJob} onSave={saveJob} onCancel={() => setEditingJob(null)} />
      </section>
    </main>

    <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark"><BriefcaseBusiness size={18} /></span> JobConnect</a><span>A learning project built with React, Spring Boot and MySQL.</span></footer>
  </div>;
}
