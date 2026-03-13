package com.insureai.backend.repository;

import com.insureai.backend.entity.PolicyApplication;
import com.insureai.backend.entity.PolicyApplication.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyApplicationRepository extends JpaRepository<PolicyApplication, Long> {
    List<PolicyApplication> findByUserId(Long userId);
    List<PolicyApplication> findByStatus(ApplicationStatus status);
    List<PolicyApplication> findByPolicyId(Long policyId);
    List<PolicyApplication> findAllByOrderByAppliedAtDesc();
}

