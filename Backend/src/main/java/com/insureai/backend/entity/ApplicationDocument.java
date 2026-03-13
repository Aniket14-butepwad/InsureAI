package com.insureai.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_documents")
@Data
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long applicationId;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentCategory category;   // ID_PROOF | INSURANCE_SPECIFIC

    @Column(nullable = false)
    private String documentType;
    // ID_PROOF:         AADHAAR, PAN, PASSPORT, VOTER_ID, DRIVING_LICENSE
    // HEALTH/LIFE:      MEDICAL_REPORT, BLOOD_TEST, ECG, PRESCRIPTION, INCOME_PROOF
    // MOTOR/TWO_WHEELER:RC_BOOK, DRIVING_LICENSE, PUC_CERTIFICATE, VEHICLE_INSPECTION
    // TRAVEL:           TRAVEL_ITINERARY, VISA_COPY, PREVIOUS_INSURANCE
    // HOME:             PROPERTY_DOCUMENTS, SALE_DEED, NOC, VALUATION_REPORT

    private String originalFileName;
    private String storedFileName;
    private String filePath;
    private String fileType;
    private Long   fileSize;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private String adminRemarks;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
        if (status == null) status = DocumentStatus.PENDING_REVIEW;
    }

    public enum DocumentCategory { ID_PROOF, INSURANCE_SPECIFIC }
    public enum DocumentStatus   { PENDING_REVIEW, VERIFIED, REJECTED }
}