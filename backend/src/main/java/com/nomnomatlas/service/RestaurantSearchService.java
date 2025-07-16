package com.nomnomatlas.service;

import com.nomnomatlas.model.DishResponseDTO;
import com.nomnomatlas.model.RestaurantsResponseDTO;
import com.nomnomatlas.repository.RestaurantRepository;
import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class RestaurantSearchService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<RestaurantsResponseDTO> searchRestaurants(
            List<String> dishes, String categoryName, LocalTime openTime, LocalTime closeTime){
        List<RestaurantEntity> restaurantEntityList = restaurantRepository.searchRestaurants(categoryName, openTime, closeTime, dishes);
        return restaurantEntityList
                .stream()
                .map(this::mapToDTO)
                .toList();

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
