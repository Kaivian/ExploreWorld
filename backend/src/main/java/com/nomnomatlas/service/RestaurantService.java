package com.nomnomatlas.service;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.model.RestaurantDTO;
import com.nomnomatlas.model.RestaurantImageDTO;
import com.nomnomatlas.repository.RestaurantRepository;
import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<RestaurantDTO> getAllRestaurantByCityId(Integer cityId){
        List<RestaurantEntity> restaurantEntityList = restaurantRepository.findByCityEntity_Id(cityId);
        return restaurantEntityList
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RestaurantDTO mapToDTO(RestaurantEntity entity){
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setOpenTime(entity.getOpenTime().toString());
        dto.setClosingTime(entity.getClosingTime().toString());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setRating(entity.getRating());
        dto.setContactInfo(entity.getContactInfo());
        dto.setCityName(entity.getCityEntity() != null ? entity.getCityEntity().getName() : null);

        // Map dish
        List<DishDTO> dishDTOList = entity.getDishEntityList().stream().map(dishEntity -> {
            DishDTO dishDTO = new DishDTO();
            dishDTO.setId(dishEntity.getId());
            dishDTO.setName(dishEntity.getName());
            dishDTO.setVideoUrl(dishEntity.getVideoUrl());
            dishDTO.setHasManualStory(dishEntity.getHasManualStory());
            dishDTO.setFeature(dishEntity.getFeature());
            dishDTO.setHistory(dishEntity.getHistory());
            dishDTO.setCategoryName(dishEntity.getCategoryEntity() != null ? dishEntity.getCategoryEntity().getName() : null);
            dishDTO.setCityName( dishEntity.getCityEntity() != null ? dishEntity.getCityEntity().getName() : null);
            return dishDTO;
        }).collect(Collectors.toList());
        dto.setDishDTOList(dishDTOList);

        // Map Image Restaurant
        List<RestaurantImageDTO> restaurantImageDTOList = entity.getRestaurantImageEntityList()
                .stream()
                .map(image -> {
            RestaurantImageDTO imageDTO = new RestaurantImageDTO();
            imageDTO.setImageUrl(image.getImageUrl());
            return imageDTO;
        }).collect(Collectors.toList());
        dto.setRestaurantImageDTOList(restaurantImageDTOList);

        return dto;
    }
}
