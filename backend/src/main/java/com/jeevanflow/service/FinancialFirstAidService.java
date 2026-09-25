package com.jeevanflow.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;

@Service
public class FinancialFirstAidService {

    public Map<String, Object> generatePlan(
            FinancialProfile profile,
            String emergencyType) {

        double income = profile.getMonthlyIncome();
        double expenses = profile.getMonthlyExpenses();
        double emi = profile.getExistingEmi();
        double savings = profile.getSavings();
        double insurance = profile.getInsuranceCoverage();

        double monthlyNeed = expenses + emi;

        double emergencyRunway = 0;

        if (monthlyNeed > 0) {
            emergencyRunway = savings / monthlyNeed;
        }

        List<String> actions = new ArrayList<>();

        // JOB LOSS
        if ("JOB_LOSS".equalsIgnoreCase(emergencyType)) {

            actions.add(
                "Protect your emergency savings and prioritize essential expenses."
            );

            actions.add(
                "Pause non-essential subscriptions and discretionary spending."
            );

            if (emi > 0) {
                actions.add(
                    "Prioritize EMI payments and contact lenders early if repayment becomes difficult."
                );
            }

            if (insurance <= 0) {
                actions.add(
                    "Review available insurance and other financial protection."
                );
            } else {
                actions.add(
                    "Review whether your current insurance coverage is sufficient."
                );
            }

            actions.add(
                "Avoid taking new high-cost debt while income is uncertain."
            );

        // MEDICAL EMERGENCY
        } else if ("MEDICAL_EMERGENCY".equalsIgnoreCase(emergencyType)) {

            actions.add(
                "Prioritize immediate medical expenses and essential household needs."
            );

            actions.add(
                "Check your health insurance coverage and claim eligibility."
            );

            actions.add(
                "Use emergency savings carefully and preserve a minimum safety buffer."
            );

            actions.add(
                "Avoid high-interest borrowing unless absolutely necessary."
            );

            actions.add(
                "Review medical and health protection after the emergency stabilizes."
            );

        // EMI STRESS
        } else if ("EMI_STRESS".equalsIgnoreCase(emergencyType)) {

            actions.add(
                "Prioritize essential EMI payments to avoid penalties and credit damage."
            );

            actions.add(
                "Contact the lender early to discuss repayment options if needed."
            );

            actions.add(
                "Reduce non-essential spending until cash flow improves."
            );

            actions.add(
                "Avoid taking another high-cost loan to repay existing debt."
            );

            actions.add(
                "Build your emergency buffer once EMI pressure becomes manageable."
            );

        // SUDDEN FINANCIAL CRISIS
        } else if ("FINANCIAL_CRISIS".equalsIgnoreCase(emergencyType)) {

            actions.add(
                "Protect your emergency savings and focus on essential expenses first."
            );

            actions.add(
                "Reduce non-essential spending immediately."
            );

            actions.add(
                "Prioritize EMI and other critical financial obligations."
            );

            actions.add(
                "Review insurance and other available financial protection."
            );

            actions.add(
                "Avoid new high-cost debt until your financial position stabilizes."
            );

        // DEFAULT
        } else {

            actions.add(
                "Protect your emergency savings and prioritize essential expenses."
            );

            if (emi > 0) {
                actions.add(
                    "Prioritize existing EMI payments and contact the lender early if repayment becomes difficult."
                );
            }

            if (insurance <= 0) {
                actions.add(
                    "Consider appropriate health and life insurance protection."
                );
            } else {
                actions.add(
                    "Review whether your current insurance coverage is sufficient."
                );
            }

            actions.add(
                "Reduce non-essential spending until income becomes stable."
            );

            actions.add(
                "Avoid taking new high-cost debt during the emergency."
            );
        }

        // RISK CALCULATION
        String riskLevel;

        if (emergencyRunway < 1) {
            riskLevel = "CRITICAL";
        } else if (emergencyRunway < 3) {
            riskLevel = "HIGH";
        } else if (emergencyRunway < 6) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "LOW";
        }

        // RESPONSE
        Map<String, Object> result = new HashMap<>();

        result.put("emergencyRunwayMonths", emergencyRunway);
        result.put("monthlyEssentialNeed", monthlyNeed);
        result.put("riskLevel", riskLevel);
        result.put("recommendedActions", actions);

        return result;
    }
}