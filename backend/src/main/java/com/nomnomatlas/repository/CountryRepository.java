package com.nomnomatlas.repository;

import com.nomnomatlas.repository.entity.CountryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface CountryRepository extends JpaRepository<CountryEntity, Integer> {
    @Query(value = "SELECT DISTINCT c.* FROM country c LEFT JOIN city ct ON c.id = ct.country_id", nativeQuery = true)
    List<CountryEntity> findAllWithCities();
}
