package com.insureai.backend.dto;

import lombok.Data;

@Data
public class PolicyDTO {

    // ── COMMON ─────────────────────────────────────────
    private String  policyName;
    private String  policyNumber;
    private String  policyType;
    private String  company;
    private String  description;
    private Double  premiumAmount;
    private String  premiumFrequency;
    private Double  coverageAmount;
    private String  keyFeatures;
    private String  riders;
    private Boolean taxBenefit;
    private String  claimSettlementRatio;
    private String  policyTerm;
    private String  status;

    // ── HEALTH ─────────────────────────────────────────
    private Integer minAge;
    private Integer maxAge;
    private String  roomRentLimit;
    private String  preExistingWaiting;
    private Boolean maternityBenefit;
    private String  cashlessHospitals;
    private String  copayPercentage;
    private String  dayCareProcedures;
    private Boolean covidCover;
    private Boolean ayushCover;

    // ── LIFE ───────────────────────────────────────────
    private Double  sumAssured;
    private Boolean deathBenefit;
    private Boolean maturityBenefit;
    private Boolean surrenderValue;
    private Boolean smokingAllowed;
    private Boolean criticalIllnessCover;
    private String  premiumPaymentTerm;

    // ── MOTOR / TWO-WHEELER ────────────────────────────
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

    // ── TRAVEL ─────────────────────────────────────────
    private String  travelDestination;
    private String  tripDuration;
    private Boolean medicalEmergency;
    private Boolean tripCancellation;
    private Boolean baggageLoss;
    private Boolean flightDelay;
    private Boolean adventureSports;
    private Boolean passportLoss;
    private Double  medicalCoverAmount;

    // ── HOME ───────────────────────────────────────────
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
    private Boolean valueablesCover;
}