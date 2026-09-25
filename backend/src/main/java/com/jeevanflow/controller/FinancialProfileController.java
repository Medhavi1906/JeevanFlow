package com.jeevanflow.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.model.FinancialProfile;
import com.jeevanflow.service.FinancialProfileService;

@RestController
@RequestMapping("/api/profile")
public class FinancialProfileController {

    private final FinancialProfileService service;

    public FinancialProfileController(FinancialProfileService service) {
        this.service = service;
    }

    @PostMapping
    public FinancialProfile createProfile(
            @RequestBody FinancialProfile profile) {

        return service.saveProfile(profile);
    }
}