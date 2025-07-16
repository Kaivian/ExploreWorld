
package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.DishEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<DishEntity, Integer> {

    List<DishEntity> findAllByCityEntityId(Integer cityId);
    List<DishEntity> findAllByCityEntityIdAndCategoryEntityName(Integer cityId, String name);
}
