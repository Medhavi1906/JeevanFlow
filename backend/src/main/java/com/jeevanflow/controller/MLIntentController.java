package com.jeevanflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jeevanflow.service.MLIntentService;

@RestController
@RequestMapping("/api/ml")
public class MLIntentController {

    private final MLIntentService mlIntentService;

    public MLIntentController(MLIntentService mlIntentService) {
        this.mlIntentService = mlIntentService;
    }

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Map<String, String> request) {

        String text = request.get("text");

        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text is required");
        }

        return mlIntentService.predictIntent(text);
    }
}