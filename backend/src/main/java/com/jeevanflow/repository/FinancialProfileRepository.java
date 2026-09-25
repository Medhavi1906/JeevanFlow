package com.jeevanflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jeevanflow.model.FinancialProfile;

public interface FinancialProfileRepository
        extends JpaRepository<FinancialProfile, Long> {
}