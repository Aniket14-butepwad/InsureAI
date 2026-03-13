package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "policy_motor")
@Data
public class MotorPolicyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("policy-motor")
    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    private String  vehicleType;
    private Double  idvAmount;
    private Boolean zeroDep;
    private Boolean roadsideAssistance;
    private Boolean engineProtection;
    private Boolean ncbProtection;
    private Boolean personalAccident;
    private Boolean consumablesCover;
    private Boolean keyReplacement;
    private Boolean invoiceCover;
    private Boolean pucCompliance;
}

