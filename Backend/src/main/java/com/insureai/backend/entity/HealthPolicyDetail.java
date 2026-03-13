package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "policy_health")
@Data
public class HealthPolicyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("policy-health")
    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    private Integer minAge;
    private Integer maxAge;
    private String  roomRentLimit;
    private String  preExistingWaiting;
    private String  cashlessHospitals;
    private String  copayPercentage;
    private String  dayCareProcedures;
    private Boolean maternityBenefit;
    private Boolean covidCover;
    private Boolean ayushCover;
}

