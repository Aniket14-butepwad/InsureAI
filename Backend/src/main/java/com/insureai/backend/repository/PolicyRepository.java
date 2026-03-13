package com.insureai.backend.repository;

import com.insureai.backend.entity.Policy;
import com.insureai.backend.entity.Policy.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    // Get all policies by type (for landing page filter)
    List<Policy> findByPolicyType(String policyType);

    // Get only ACTIVE policies (for customers)
    List<Policy> findByStatus(PolicyStatus status);

    // Get active policies by type
    List<Policy> findByPolicyTypeAndStatus(String policyType, PolicyStatus status);

    // Search by name
    List<Policy> findByPolicyNameContainingIgnoreCase(String name);
}