import { useEffect, useState } from "react";

const emptyJob = {
  title: "", company: "", location: "", jobType: "Full-time",
  description: "", salaryMin: "", salaryMax: ""
};

export default function JobForm({ editingJob, onSave, onCancel }) {
  const [job, setJob] = useState(emptyJob);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setJob(editingJob ? {
      ...editingJob,
      salaryMin: editingJob.salaryMin ?? "",
      salaryMax: editingJob.salaryMax ?? ""
    } : emptyJob);
    setError("");
  }, [editingJob]);

  function change(event) {
    setJob(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (job.salaryMin !== "" && Number(job.salaryMin) < 0) {
      setError("Minimum salary cannot be negative."); return;
    }
    if (job.salaryMax !== "" && Number(job.salaryMax) < 0) {
      setError("Maximum salary cannot be negative."); return;
    }
    if (job.salaryMin !== "" && job.salaryMax !== "" &&
        Number(job.salaryMin) > Number(job.salaryMax)) {
      setError("Minimum salary cannot exceed maximum salary."); return;
    }
    const payload = {
      ...job,
      salaryMin: job.salaryMin === "" ? null : Number(job.salaryMin),
      salaryMax: job.salaryMax === "" ? null : Number(job.salaryMax)
    };
    setSaving(true);
    try {
      await onSave(payload);
      if (!editingJob) setJob(emptyJob);
    } catch (e) {
      setError(e.message || "Could not save this job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel job-form" onSubmit={submit}>
      <div className="section-heading">
        <div><p className="eyebrow">{editingJob ? "UPDATE LISTING" : "FOR EMPLOYERS"}</p>
          <h2>{editingJob ? "Edit job listing" : "Post a new job"}</h2></div>
        {editingJob && <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>}
      </div>
      <div className="form-grid">
        <label>Job title<input name="title" value={job.title} onChange={change} placeholder="e.g. Java Developer" required maxLength="150" /></label>
        <label>Company<input name="company" value={job.company} onChange={change} placeholder="Company name" required maxLength="150" /></label>
        <label>Location<input name="location" value={job.location} onChange={change} placeholder="e.g. Hyderabad" required maxLength="150" /></label>
        <label>Job type<select name="jobType" value={job.jobType} onChange={change}>
          <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option>
        </select></label>
        <label>Minimum annual salary (₹)<input type="number" name="salaryMin" min="0" value={job.salaryMin} onChange={change} placeholder="e.g. 400000" /></label>
        <label>Maximum annual salary (₹)<input type="number" name="salaryMax" min="0" value={job.salaryMax} onChange={change} placeholder="e.g. 700000" /></label>
        <label className="full-width">Job description<textarea name="description" value={job.description} onChange={change} placeholder="Responsibilities, skills and qualifications..." required rows="4" /></label>
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <button className="button primary" disabled={saving} type="submit">
        {saving ? "Saving..." : editingJob ? "Save changes" : "Publish job"}
      </button>
    </form>
  );
}
