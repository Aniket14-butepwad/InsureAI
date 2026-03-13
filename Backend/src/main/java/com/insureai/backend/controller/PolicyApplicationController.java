package com.insureai.backend.controller;

import com.insureai.backend.dto.PolicyApplicationDTO;
import com.insureai.backend.entity.PolicyApplication;
import com.insureai.backend.service.PolicyApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class PolicyApplicationController {

    @Autowired
    private PolicyApplicationService applicationService;

    // POST /api/applications — Customer applies
    @PostMapping
    public ResponseEntity<?> applyForPolicy(@RequestBody PolicyApplicationDTO dto) {
        try {
            PolicyApplication app = applicationService.applyForPolicy(dto);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // GET /api/applications — Admin gets all
    @GetMapping
    public ResponseEntity<List<PolicyApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // GET /api/applications/user/{userId} — Customer gets own
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PolicyApplication>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userId));
    }

    // GET /api/applications/status/PENDING — Filter by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PolicyApplication>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(applicationService.getApplicationsByStatus(status));
    }

    // GET /api/applications/{id} — Single application
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(applicationService.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/applications/{id}/status — Admin approves/rejects
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody PolicyApplicationDTO dto) {
        try {
            PolicyApplication updated = applicationService.updateStatus(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // DELETE /api/applications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            applicationService.deleteApplication(id);
            return ResponseEntity.ok("Application deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

