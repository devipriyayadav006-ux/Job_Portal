const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/jobs";

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getJobs() {
  return handleResponse(await fetch(API_URL));
}
export async function createJob(job) {
  return handleResponse(await fetch(API_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  }));
}
export async function updateJob(id, job) {
  return handleResponse(await fetch(`${API_URL}/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  }));
}
export async function deleteJob(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`, { method: "DELETE" }));
}
