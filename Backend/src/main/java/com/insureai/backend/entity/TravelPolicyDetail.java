package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "policy_travel")
@Data
public class TravelPolicyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("policy-travel")
    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    private Integer minAge;
    private Integer maxAge;
    private String  travelDestination;
    private String  tripDuration;
    private Double  medicalCoverAmount;
    private Boolean medicalEmergency;
    private Boolean tripCancellation;
    private Boolean baggageLoss;
    private Boolean flightDelay;
    private Boolean adventureSports;
    private Boolean passportLoss;
}

