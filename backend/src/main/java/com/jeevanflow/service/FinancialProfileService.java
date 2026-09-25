package com.jeevanflow.service;

import org.springframework.stereotype.Service;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;

@Service
public class FinancialProfileService {

    private final FinancialProfileRepository repository;

    public FinancialProfileService(FinancialProfileRepository repository) {
        this.repository = repository;
    }

    public FinancialProfile saveProfile(FinancialProfile profile) {
        return repository.save(profile);
    }
}