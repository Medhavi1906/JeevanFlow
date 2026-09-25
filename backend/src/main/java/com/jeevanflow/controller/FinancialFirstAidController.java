package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.repository.FinancialProfileRepository;
import com.jeevanflow.service.FinancialFirstAidService;

@RestController
@RequestMapping("/api/first-aid")
public class FinancialFirstAidController {

    private final FinancialFirstAidService service;
    private final FinancialProfileRepository repository;

    public FinancialFirstAidController(
            FinancialFirstAidService service,
            FinancialProfileRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getFirstAid(
            @PathVariable Long id,
            @RequestParam String emergencyType) {

        FinancialProfile profile = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return service.generatePlan(profile, emergencyType);
    }
}