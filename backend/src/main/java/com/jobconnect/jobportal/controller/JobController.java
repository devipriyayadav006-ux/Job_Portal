package com.jobconnect.jobportal.controller;

import com.jobconnect.jobportal.model.Job;
import com.jobconnect.jobportal.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class JobController {
    private final JobService service;
    public JobController(JobService service) { this.service = service; }

    @GetMapping
    public List<Job> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getById(@PathVariable long id) {
        return service.getById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Job job) {
        if (!isValid(job)) {
            return ResponseEntity.badRequest().body("Required fields are missing or salary values are invalid.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody Job job) {
        if (!isValid(job)) {
            return ResponseEntity.badRequest().body("Required fields are missing or salary values are invalid.");
        }
        if (!service.update(id, job)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        if (!service.delete(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    private boolean isValid(Job job) {
        return job != null && hasText(job.getTitle()) && hasText(job.getCompany())
            && hasText(job.getLocation()) && hasText(job.getJobType())
            && hasText(job.getDescription())
            && (job.getSalaryMin() == null || job.getSalaryMin().signum() >= 0)
            && (job.getSalaryMax() == null || job.getSalaryMax().signum() >= 0)
            && (job.getSalaryMin() == null || job.getSalaryMax() == null
                || job.getSalaryMin().compareTo(job.getSalaryMax()) <= 0);
    }

    private boolean hasText(String value) { return value != null && !value.isBlank(); }
}
