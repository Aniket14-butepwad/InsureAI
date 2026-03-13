package com.insureai.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_applications")
@Data
public class PolicyApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long policyId;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String applicantEmail;

    private String applicantPhone;
    private String applicantDob;
    private String applicantAddress;
    private String nomineeName;
    private String nomineeRelation;
    private String remarks;

    // Snapshot of policy at time of application
    private String policyName;
    private String policyNumber;
    private String policyType;
    private String company;
    private Double premiumAmount;
    private String premiumFrequency;
    private Double coverageAmount;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private String applicationNumber;
    private String adminRemarks;

    @Column(updatable = false)
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ApplicationStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED, UNDER_REVIEW
    }
}

