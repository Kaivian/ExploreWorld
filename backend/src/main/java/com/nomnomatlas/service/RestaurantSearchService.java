package com.nomnomatlas.service;

import com.nomnomatlas.model.DishResponseDTO;
import com.nomnomatlas.model.RestaurantsResponseDTO;
import com.nomnomatlas.repository.RestaurantRepository; // Thay đổi 1: Import Specification
import com.nomnomatlas.repository.custom.RestaurantSpecification;
import com.nomnomatlas.repository.entity.DishEntity;
import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification; // Thay đổi 2: Import Specification
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantSearchService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<RestaurantsResponseDTO> searchRestaurants(
            List<String> dishes, String categoryName, LocalTime openTime, LocalTime closeTime){
        Specification<RestaurantEntity> spec = RestaurantSpecification.search(categoryName, openTime, closeTime, dishes);
        List<RestaurantEntity> restaurantEntityList = restaurantRepository.findAll(spec);
        return restaurantEntityList
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<RestaurantsResponseDTO> searchRestaurantByNameDish(String name){
        return restaurantRepository.findByDishName(name)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RestaurantsResponseDTO mapToDTO(RestaurantEntity entity){
        RestaurantsResponseDTO dto = new RestaurantsResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        return dto;
    }
}