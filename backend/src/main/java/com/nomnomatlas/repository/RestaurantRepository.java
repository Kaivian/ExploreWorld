package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {
    List<RestaurantEntity> findByCityEntity_Id(Integer cityId);
    @Query(value = """ 
                SELECT DISTINCT r.*
                FROM restaurant r
                JOIN restaurant_dish rd ON r.id = rd.restaurant_id
                JOIN dish d ON d.id = rd.dish_id
                JOIN category c ON c.id = d.category_id
                WHERE (:categoryName IS NULL OR LOWER(c.name) = LOWER(:categoryName))
                AND (:openTime IS NULL OR r.opening_time <= :openTime)
                AND (:closeTime IS NULL OR r.closing_time >= :closeTime)
                AND (:dishNames IS NULL OR LOWER(d.name) IN (:dishNames))""", nativeQuery = true)
    List<RestaurantEntity> searchRestaurants(
            @Param("categoryName") String categoryName,
            @Param("openTime") LocalTime openTime,
            @Param("closeTime") LocalTime closeTime,
            @Param("dishNames") List<String> dishNames
    );
}
