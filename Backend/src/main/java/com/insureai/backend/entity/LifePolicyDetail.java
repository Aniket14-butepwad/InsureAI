package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "policy_life")
@Data
public class LifePolicyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("policy-life")
    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    private Integer minAge;
    private Integer maxAge;
    private String  policyTerm;
    private String  premiumPaymentTerm;
    private Double  sumAssured;
    private Boolean deathBenefit;
    private Boolean maturityBenefit;
    private Boolean surrenderValue;
    private Boolean smokingAllowed;
    private Boolean criticalIllnessCover;
}

