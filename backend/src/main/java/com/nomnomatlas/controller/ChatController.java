package com.nomnomatlas.controller;

import com.nomnomatlas.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String reply = geminiService.chatWithGemini(message);
        return ResponseEntity.ok(reply);
    }
}

