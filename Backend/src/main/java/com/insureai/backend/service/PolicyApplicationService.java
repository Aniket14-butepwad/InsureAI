package com.insureai.backend.service;

import com.insureai.backend.dto.PolicyApplicationDTO;
import com.insureai.backend.entity.Policy;
import com.insureai.backend.entity.PolicyApplication;
import com.insureai.backend.entity.PolicyApplication.ApplicationStatus;
import com.insureai.backend.repository.PolicyApplicationRepository;
import com.insureai.backend.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PolicyApplicationService {

    @Autowired
    private PolicyApplicationRepository applicationRepository;

    @Autowired
    private PolicyRepository policyRepository;

    // ── Customer submits application ───────────────────
    public PolicyApplication applyForPolicy(PolicyApplicationDTO dto) {
        Policy policy = policyRepository.findById(dto.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found: " + dto.getPolicyId()));

        PolicyApplication app = new PolicyApplication();
        app.setUserId(dto.getUserId());
        app.setPolicyId(dto.getPolicyId());
        app.setApplicantName(dto.getApplicantName());
        app.setApplicantEmail(dto.getApplicantEmail());
        app.setApplicantPhone(dto.getApplicantPhone());
        app.setApplicantDob(dto.getApplicantDob());
        app.setApplicantAddress(dto.getApplicantAddress());
        app.setNomineeName(dto.getNomineeName());
        app.setNomineeRelation(dto.getNomineeRelation());
        app.setRemarks(dto.getRemarks());

        // Snapshot policy details
        app.setPolicyName(policy.getPolicyName());
        app.setPolicyNumber(policy.getPolicyNumber());
        app.setPolicyType(policy.getPolicyType());
        app.setCompany(policy.getCompany());
        app.setPremiumAmount(policy.getPremiumAmount());
        app.setPremiumFrequency(policy.getPremiumFrequency());
        app.setCoverageAmount(policy.getCoverageAmount());
        app.setStatus(ApplicationStatus.PENDING);

        // Generate application number: APP-YYYY-XXXXX
        String year = String.valueOf(LocalDateTime.now().getYear());
        long count   = applicationRepository.count() + 1;
        app.setApplicationNumber("APP-" + year + "-" + String.format("%05d", count));

        return applicationRepository.save(app);
    }

    // ── Get all applications (Admin) ───────────────────
    public List<PolicyApplication> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedAtDesc();
    }

    // ── Get applications for one customer ──────────────
    public List<PolicyApplication> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    // ── Get applications by status ─────────────────────
    public List<PolicyApplication> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(ApplicationStatus.valueOf(status.toUpperCase()));
    }

    // ── Get single application ─────────────────────────
    public PolicyApplication getById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }

    // ── Admin approves or rejects ──────────────────────
    public PolicyApplication updateStatus(Long id, PolicyApplicationDTO dto) {
        PolicyApplication app = getById(id);
        app.setStatus(ApplicationStatus.valueOf(dto.getStatus().toUpperCase()));
        if (dto.getAdminRemarks() != null) {
            app.setAdminRemarks(dto.getAdminRemarks());
        }
        return applicationRepository.save(app);
    }

    // ── Delete ─────────────────────────────────────────
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}

