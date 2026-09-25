package com.jeevanflow.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private double monthlyIncome;
    private double monthlyExpenses;
    private double savings;
    private double existingEmi;
    private double insuranceCoverage;

    public FinancialProfile() {
    }

    public Long getId() {
        return id;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public double getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(double monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }

    public double getSavings() {
        return savings;
    }

    public void setSavings(double savings) {
        this.savings = savings;
    }

    public double getExistingEmi() {
        return existingEmi;
    }

    public void setExistingEmi(double existingEmi) {
        this.existingEmi = existingEmi;
    }

    public double getInsuranceCoverage() {
        return insuranceCoverage;
    }

    public void setInsuranceCoverage(double insuranceCoverage) {
        this.insuranceCoverage = insuranceCoverage;
    }
}