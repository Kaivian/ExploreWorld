package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.RestaurantEntity;
import com.nomnomatlas.repository.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    @Query(value = "SELECT AVG(r.rating) FROM review r WHERE r.restaurant_id = :restaurantId", nativeQuery = true)
    Double getAverageRatingByRestaurant(@Param("restaurantId") Integer restaurantId);

}