package com.insureai.backend.controller;

import com.insureai.backend.dto.PolicyDTO;
import com.insureai.backend.entity.Policy;
import com.insureai.backend.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    // ══════════════════════════════════════════════════
    // POST /api/policies
    // Admin creates a new policy
    // ══════════════════════════════════════════════════
    @PostMapping
    public ResponseEntity<?> createPolicy(
            @RequestBody PolicyDTO dto) {
        try {
            Policy created = policyService.createPolicy(dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error creating policy: " + e.getMessage());
        }
    }

    // ══════════════════════════════════════════════════
    // GET /api/policies
    // Admin gets ALL policies (Active + Draft + Inactive)
    // ══════════════════════════════════════════════════
    @GetMapping
    public ResponseEntity<List<Policy>> getAllPolicies() {
        return ResponseEntity.ok(
                policyService.getAllPolicies());
    }

    // ══════════════════════════════════════════════════
    // GET /api/policies/active
    // Customer sees only ACTIVE policies
    // ══════════════════════════════════════════════════
    @GetMapping("/active")
    public ResponseEntity<List<Policy>> getActivePolicies() {
        return ResponseEntity.ok(
                policyService.getActivePolicies());
    }

    // ══════════════════════════════════════════════════
    // GET /api/policies/{id}
    // Get single policy by ID
    // ══════════════════════════════════════════════════
    @GetMapping("/{id}")
    public ResponseEntity<?> getPolicyById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    policyService.getPolicyById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ══════════════════════════════════════════════════
    // GET /api/policies/type/HEALTH
    // Landing page filter by insurance type
    // ══════════════════════════════════════════════════
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Policy>> getPoliciesByType(
            @PathVariable String type) {
        return ResponseEntity.ok(
                policyService.getPoliciesByType(type));
    }

    // ══════════════════════════════════════════════════
    // GET /api/policies/search?keyword=star
    // Search policies by name
    // ══════════════════════════════════════════════════
    @GetMapping("/search")
    public ResponseEntity<List<Policy>> searchPolicies(
            @RequestParam String keyword) {
        return ResponseEntity.ok(
                policyService.searchPolicies(keyword));
    }

    // ══════════════════════════════════════════════════
    // PUT /api/policies/{id}
    // Admin updates existing policy
    // ══════════════════════════════════════════════════
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(
            @PathVariable Long id,
            @RequestBody PolicyDTO dto) {
        try {
            Policy updated = policyService.updatePolicy(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error updating policy: " + e.getMessage());
        }
    }

    // ══════════════════════════════════════════════════
    // DELETE /api/policies/{id}
    // Admin deletes a policy
    // ══════════════════════════════════════════════════
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(
            @PathVariable Long id) {
        try {
            policyService.deletePolicy(id);
            return ResponseEntity.ok(
                    "Policy deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }
}