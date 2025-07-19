package com.nomnomatlas.controller;

import com.nomnomatlas.service.GeminiService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // DTOs (records) bên trong hoặc tách file riêng
    public record ChatRequest(String message) {}
    public record ChatResponse(String reply) {}

    @PostMapping(
            value = "/chat",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = geminiService.chatWithGemini(request.message());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
