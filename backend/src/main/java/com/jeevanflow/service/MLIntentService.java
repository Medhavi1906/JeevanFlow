package com.jeevanflow.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MLIntentService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> predictIntent(String text) {

        String url = "http://localhost:5000/predict";

        Map<String, String> request = new HashMap<>();
        request.put("text", text);

        Map<String, Object> response =
                restTemplate.postForObject(url, request, Map.class);

        return response;
    }
}