package com.insureai.backend.dto;

import lombok.Data;

@Data
public class PolicyApplicationDTO {
    // Who is applying
    private Long   userId;
    private Long   policyId;

    // Applicant details
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantDob;
    private String applicantAddress;
    private String nomineeName;
    private String nomineeRelation;
    private String remarks;

    // Admin use only (for approve/reject)
    private String status;
    private String adminRemarks;
}

