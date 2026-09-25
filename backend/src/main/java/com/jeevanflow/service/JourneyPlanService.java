package com.jeevanflow.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class JourneyPlanService {

    public Map<String, Object> analyze(
            double journeyAmount,
            double monthlyIncome,
            double monthlyExpenses,
            double monthlySavings,
            double existingEmi,
            String intent
    ) {

        Map<String, Object> result = new LinkedHashMap<>();

        double disposableIncome =
                monthlyIncome - monthlyExpenses - existingEmi;

        double fundingGap =
                Math.max(0, journeyAmount - monthlySavings);

        double monthlyAvailable =
                Math.max(0, disposableIncome);

        double monthsToGoal = monthlyAvailable > 0
                ? fundingGap / monthlyAvailable
                : -1;

        double emiImpact =
                monthlyIncome > 0
                        ? (existingEmi / monthlyIncome) * 100
                        : 0;

        String risk;

        if (monthlyIncome <= 0) {
            risk = "HIGH";
        } else if (disposableIncome <= 0) {
            risk = "HIGH";
        } else if (emiImpact >= 40) {
            risk = "HIGH";
        } else if (emiImpact >= 25 || fundingGap > monthlyIncome * 6) {
            risk = "MEDIUM";
        } else {
            risk = "LOW";
        }

        result.put("intent", intent);
        result.put("journeyAmount", round(journeyAmount));
        result.put("monthlyIncome", round(monthlyIncome));
        result.put("monthlyExpenses", round(monthlyExpenses));
        result.put("monthlySavings", round(monthlySavings));
        result.put("existingEmi", round(existingEmi));

        result.put("disposableIncome", round(disposableIncome));
        result.put("fundingGap", round(fundingGap));
        result.put("monthsToGoal",
                monthsToGoal < 0 ? null : round(monthsToGoal));

        result.put("emiImpact", round(emiImpact));
        result.put("riskLevel", risk);

        result.put(
                "message",
                generateMessage(intent, fundingGap, risk)
        );

        result.put(
                "recommendation",
                generateRecommendation(
                        fundingGap,
                        monthlyAvailable,
                        risk
                )
        );

        return result;
    }

    private String generateMessage(
            String intent,
            double fundingGap,
            String risk
    ) {

        if (fundingGap <= 0) {
            return "Your available savings can cover the planned financial goal.";
        }

        if ("WEDDING".equalsIgnoreCase(intent)) {
            return "Your wedding goal has a funding gap that should be planned carefully.";
        }

        if ("EDUCATION".equalsIgnoreCase(intent)) {
            return "Your education goal requires a structured funding plan.";
        }

        if ("HOUSE".equalsIgnoreCase(intent)) {
            return "Your home purchase requires evaluation of the funding gap and EMI impact.";
        }

        if ("MEDICAL".equalsIgnoreCase(intent)) {
            return "Your medical expense should be handled while protecting your emergency buffer.";
        }

        if ("JOB_LOSS".equalsIgnoreCase(intent)) {
            return "Your priority should be maintaining essential expenses and emergency liquidity.";
        }

        return "Your financial goal has been analyzed against your current financial profile.";
    }

    private String generateRecommendation(
            double fundingGap,
            double monthlyAvailable,
            String risk
    ) {

        if (fundingGap <= 0) {
            return "Use your existing savings carefully and maintain an emergency buffer.";
        }

        if (monthlyAvailable <= 0) {
            return "Your current disposable income is insufficient. Review expenses and avoid taking on additional debt without a repayment plan.";
        }

        if ("HIGH".equals(risk)) {
            return "Consider reducing the funding gap, increasing savings, or delaying non-essential spending before taking additional debt.";
        }

        if ("MEDIUM".equals(risk)) {
            return "Compare saving longer with financing options and keep your monthly EMI burden within a manageable range.";
        }

        return "You may be able to plan this goal through a combination of savings and carefully evaluated financing.";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}