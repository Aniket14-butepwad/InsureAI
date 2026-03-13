package com.insureai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "policy_home")
@Data
public class HomePolicyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("policy-home")
    @OneToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    private String  propertyType;
    private String  constructionType;
    private String  propertyAge;
    private Double  sumInsuredProperty;
    private Boolean structureCover;
    private Boolean contentCover;
    private Boolean naturalDisaster;
    private Boolean burglaryProtection;
    private Boolean alternateAccommodation;
    private Boolean publicLiability;
    private Boolean valueablesCover;   // extra 'e' — matches Java entity exactly
}

