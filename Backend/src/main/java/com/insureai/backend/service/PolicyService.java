package com.insureai.backend.service;

import com.insureai.backend.dto.PolicyDTO;
import com.insureai.backend.entity.*;
import com.insureai.backend.entity.Policy.PolicyStatus;
import com.insureai.backend.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    // ══════════════════════════════════════════════════
    // CREATE
    // ══════════════════════════════════════════════════
    public Policy createPolicy(PolicyDTO dto) {
        Policy policy = new Policy();
        mapCommonFields(dto, policy);
        addTypeSpecificDetails(dto, policy);
        return policyRepository.save(policy);
    }

    // ══════════════════════════════════════════════════
    // READ — All (Admin)
    // ══════════════════════════════════════════════════
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    // ══════════════════════════════════════════════════
    // READ — Active only (Customer)
    // ══════════════════════════════════════════════════
    public List<Policy> getActivePolicies() {
        return policyRepository.findByStatus(PolicyStatus.ACTIVE);
    }

    // ══════════════════════════════════════════════════
    // READ — By ID
    // ══════════════════════════════════════════════════
    public Policy getPolicyById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Policy not found with id: " + id));
    }

    // ══════════════════════════════════════════════════
    // READ — By Type (Landing Page Filter)
    // ══════════════════════════════════════════════════
    public List<Policy> getPoliciesByType(String type) {
        return policyRepository.findByPolicyTypeAndStatus(
                type.toUpperCase(), PolicyStatus.ACTIVE
        );
    }

    // ══════════════════════════════════════════════════
    // READ — Search by name
    // ══════════════════════════════════════════════════
    public List<Policy> searchPolicies(String keyword) {
        return policyRepository
                .findByPolicyNameContainingIgnoreCase(keyword);
    }

    // ══════════════════════════════════════════════════
    // UPDATE
    // ══════════════════════════════════════════════════
    public Policy updatePolicy(Long id, PolicyDTO dto) {
        Policy policy = getPolicyById(id);
        mapCommonFields(dto, policy);
        addTypeSpecificDetails(dto, policy);
        return policyRepository.save(policy);
    }

    // ══════════════════════════════════════════════════
    // DELETE
    // ══════════════════════════════════════════════════
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new RuntimeException(
                    "Policy not found with id: " + id);
        }
        policyRepository.deleteById(id);
    }

    // ══════════════════════════════════════════════════
    // HELPER — Map common fields
    // ══════════════════════════════════════════════════
    private void mapCommonFields(PolicyDTO dto, Policy policy) {
        policy.setPolicyName(dto.getPolicyName());
        policy.setPolicyNumber(dto.getPolicyNumber());
        policy.setPolicyType(dto.getPolicyType().toUpperCase());
        policy.setCompany(dto.getCompany());
        policy.setDescription(dto.getDescription());
        policy.setPremiumAmount(dto.getPremiumAmount());
        policy.setPremiumFrequency(dto.getPremiumFrequency());
        policy.setCoverageAmount(dto.getCoverageAmount());
        policy.setKeyFeatures(dto.getKeyFeatures());
        policy.setRiders(dto.getRiders());
        policy.setTaxBenefit(dto.getTaxBenefit());
        policy.setClaimSettlementRatio(dto.getClaimSettlementRatio());
        policy.setPolicyTerm(dto.getPolicyTerm());

        if (dto.getStatus() != null) {
            policy.setStatus(
                    Policy.PolicyStatus.valueOf(
                            dto.getStatus().toUpperCase()));
        } else {
            policy.setStatus(PolicyStatus.ACTIVE);
        }
    }

    // ══════════════════════════════════════════════════
    // HELPER — Add type-specific details
    // ══════════════════════════════════════════════════
    private void addTypeSpecificDetails(PolicyDTO dto, Policy policy) {
        String type = dto.getPolicyType().toUpperCase();

        switch (type) {

            case "HEALTH":
                HealthPolicyDetail health =
                        policy.getHealthDetail() != null
                                ? policy.getHealthDetail()
                                : new HealthPolicyDetail();

                health.setPolicy(policy);
                health.setMinAge(dto.getMinAge());
                health.setMaxAge(dto.getMaxAge());
                health.setRoomRentLimit(dto.getRoomRentLimit());
                health.setPreExistingWaiting(dto.getPreExistingWaiting());
                health.setMaternityBenefit(dto.getMaternityBenefit());
                health.setCashlessHospitals(dto.getCashlessHospitals());
                health.setCopayPercentage(dto.getCopayPercentage());
                health.setDayCareProcedures(dto.getDayCareProcedures());
                health.setCovidCover(dto.getCovidCover());
                health.setAyushCover(dto.getAyushCover());
                policy.setHealthDetail(health);
                break;

            case "LIFE":
                LifePolicyDetail life =
                        policy.getLifeDetail() != null
                                ? policy.getLifeDetail()
                                : new LifePolicyDetail();

                life.setPolicy(policy);
                life.setMinAge(dto.getMinAge());
                life.setMaxAge(dto.getMaxAge());
                life.setPolicyTerm(dto.getPolicyTerm());
                life.setSumAssured(dto.getSumAssured());
                life.setDeathBenefit(dto.getDeathBenefit());
                life.setMaturityBenefit(dto.getMaturityBenefit());
                life.setSurrenderValue(dto.getSurrenderValue());
                life.setSmokingAllowed(dto.getSmokingAllowed());
                life.setCriticalIllnessCover(dto.getCriticalIllnessCover());
                life.setPremiumPaymentTerm(dto.getPremiumPaymentTerm());
                policy.setLifeDetail(life);
                break;

            case "MOTOR":
            case "TWO_WHEELER":
                MotorPolicyDetail motor =
                        policy.getMotorDetail() != null
                                ? policy.getMotorDetail()
                                : new MotorPolicyDetail();

                motor.setPolicy(policy);
                motor.setVehicleType(dto.getVehicleType());
                motor.setIdvAmount(dto.getIdvAmount());
                motor.setZeroDep(dto.getZeroDep());
                motor.setRoadsideAssistance(dto.getRoadsideAssistance());
                motor.setEngineProtection(dto.getEngineProtection());
                motor.setNcbProtection(dto.getNcbProtection());
                motor.setPersonalAccident(dto.getPersonalAccident());
                motor.setConsumablesCover(dto.getConsumablesCover());
                motor.setKeyReplacement(dto.getKeyReplacement());
                motor.setInvoiceCover(dto.getInvoiceCover());
                motor.setPucCompliance(dto.getPucCompliance());
                policy.setMotorDetail(motor);
                break;

            case "TRAVEL":
                TravelPolicyDetail travel =
                        policy.getTravelDetail() != null
                                ? policy.getTravelDetail()
                                : new TravelPolicyDetail();

                travel.setPolicy(policy);
                travel.setMinAge(dto.getMinAge());
                travel.setMaxAge(dto.getMaxAge());
                travel.setTravelDestination(dto.getTravelDestination());
                travel.setTripDuration(dto.getTripDuration());
                travel.setMedicalEmergency(dto.getMedicalEmergency());
                travel.setTripCancellation(dto.getTripCancellation());
                travel.setBaggageLoss(dto.getBaggageLoss());
                travel.setFlightDelay(dto.getFlightDelay());
                travel.setAdventureSports(dto.getAdventureSports());
                travel.setPassportLoss(dto.getPassportLoss());
                travel.setMedicalCoverAmount(dto.getMedicalCoverAmount());
                policy.setTravelDetail(travel);
                break;

            case "HOME":
                HomePolicyDetail home =
                        policy.getHomeDetail() != null
                                ? policy.getHomeDetail()
                                : new HomePolicyDetail();

                home.setPolicy(policy);
                home.setPropertyType(dto.getPropertyType());
                home.setConstructionType(dto.getConstructionType());
                home.setPropertyAge(dto.getPropertyAge());
                home.setSumInsuredProperty(dto.getSumInsuredProperty());
                home.setStructureCover(dto.getStructureCover());
                home.setContentCover(dto.getContentCover());
                home.setNaturalDisaster(dto.getNaturalDisaster());
                home.setBurglaryProtection(dto.getBurglaryProtection());
                home.setAlternateAccommodation(
                        dto.getAlternateAccommodation());
                home.setPublicLiability(dto.getPublicLiability());
                home.setValueablesCover(dto.getValueablesCover());
                policy.setHomeDetail(home);
                break;

            default:
                throw new RuntimeException(
                        "Unknown policy type: " + type +
                                ". Allowed: HEALTH, LIFE, MOTOR, TWO_WHEELER, TRAVEL, HOME");
        }
    }
}