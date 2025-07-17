
package com.nomnomatlas.service;

import com.nomnomatlas.model.ReviewRequestDTO;
import com.nomnomatlas.repository.RestaurantRepository;
import com.nomnomatlas.repository.ReviewRepository;
import com.nomnomatlas.repository.UserRepository;
import com.nomnomatlas.repository.entity.RestaurantEntity;
import com.nomnomatlas.repository.entity.ReviewEntity;
import com.nomnomatlas.repository.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    public double submitReview(Integer restaurantId, ReviewRequestDTO dto, String username) {
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        RestaurantEntity restaurantEntity = restaurantRepository.findById(restaurantId).orElseThrow();
        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setComment(dto.getComment());
        reviewEntity.setRating(dto.getRating());
        reviewEntity.setCreateDate(LocalDateTime.now());
        reviewEntity.setRestaurantEntity(restaurantEntity);
        reviewEntity.setUserEntity(userEntity);
        reviewRepository.save(reviewEntity);

        // Cập nhật lại AVG rating
        Double avg = reviewRepository.getAverageRatingByRestaurant(restaurantId);
        restaurantEntity.setRating(avg);
        return avg;
    }
}
