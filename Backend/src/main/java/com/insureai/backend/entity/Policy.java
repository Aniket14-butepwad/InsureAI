package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
@Data
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── COMMON FIELDS ──────────────────────────────────
    @Column(nullable = false)
    private String policyName;

    @Column(unique = true, nullable = false)
    private String policyNumber;

    @Column(nullable = false)
    private String policyType;

    @Column(nullable = false)
    private String company;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double premiumAmount;
    private String premiumFrequency;

    private Double coverageAmount;

    @Column(columnDefinition = "TEXT")
    private String keyFeatures;

    @Column(columnDefinition = "TEXT")
    private String riders;

    private Boolean taxBenefit;
    private String  claimSettlementRatio;
    private String  policyTerm;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── RELATIONS — @JsonManagedReference prevents infinite recursion ──────
    @JsonManagedReference("policy-health")
    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private HealthPolicyDetail healthDetail;

    @JsonManagedReference("policy-life")
    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private LifePolicyDetail lifeDetail;

    @JsonManagedReference("policy-motor")
    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private MotorPolicyDetail motorDetail;

    @JsonManagedReference("policy-travel")
    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private TravelPolicyDetail travelDetail;

    @JsonManagedReference("policy-home")
    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private HomePolicyDetail homeDetail;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = PolicyStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PolicyStatus {
        ACTIVE, INACTIVE, DRAFT
    }
}

