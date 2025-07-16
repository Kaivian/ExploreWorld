package com.nomnomatlas.controller;

import com.nomnomatlas.model.ReviewDTO;
import com.nomnomatlas.model.ReviewRequestDTO;
import com.nomnomatlas.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/api/restaurant/{restaurantId}/review")
        public ResponseEntity<Double> submitReview(@PathVariable Integer restaurantId,
                                                 @RequestBody ReviewRequestDTO reviewRequestDTO,
                                                 Principal principal){
            Double avgRating = reviewService.submitReview(restaurantId, reviewRequestDTO, principal.getName());
            return ResponseEntity.ok(avgRating);
    }
}
