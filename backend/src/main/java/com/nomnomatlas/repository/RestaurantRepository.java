
package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer>, JpaSpecificationExecutor<RestaurantEntity> {
    List<RestaurantEntity> findByCityEntity_Id(Integer cityId);

    @Query(
            value = """
            SELECT r.* 
            FROM restaurant r
            JOIN restaurant_dish rd ON r.id = rd.restaurant_id
            JOIN dish d ON rd.dish_id = d.id
            WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :dishName, '%'))
        """,
            nativeQuery = true
    )
    List<RestaurantEntity> findByDishName(@Param("dishName") String dishName);
}
