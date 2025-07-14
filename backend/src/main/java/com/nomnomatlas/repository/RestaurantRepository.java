package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {
    List<RestaurantEntity> findByCityEntity_Id(Integer cityId);
}
