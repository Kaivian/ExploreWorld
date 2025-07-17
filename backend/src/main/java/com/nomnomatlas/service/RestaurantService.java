package com.nomnomatlas.service;

import com.nomnomatlas.model.*;
import com.nomnomatlas.repository.RestaurantRepository;
import com.nomnomatlas.repository.entity.RestaurantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<RestaurantsResponseDTO> getAllRestaurantByCityId(Integer cityId){
        List<RestaurantEntity> restaurantEntityList = restaurantRepository.findByCityEntity_Id(cityId);
        return restaurantEntityList
                .stream()
                .map(entity -> {
                    RestaurantsResponseDTO dto = new RestaurantsResponseDTO();
                    dto.setId(entity.getId());
                    dto.setName(entity.getName());
                    dto.setLatitude(entity.getLatitude());
                    dto.setLongitude(entity.getLongitude());
                    return dto;
                }).collect(Collectors.toList());
    }

    public RestaurantDTO getRestaurantById(Integer restaurantId){
        RestaurantEntity restaurantEntity = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
        return mapToDTO(restaurantEntity);
    }

    public RestaurantDTO mapToDTO(RestaurantEntity entity){
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setOpenTime(entity.getOpeningTime().toString());
        dto.setClosingTime(entity.getClosingTime().toString());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setRating(entity.getRating());
        dto.setContactInfo(entity.getContactInfo());
        dto.setCityName(entity.getCityEntity() != null ? entity.getCityEntity().getName() : null);

        // Map dish
        List<DishResponseDTO> dishResponseDTOList = entity.getDishEntityList()
                .stream()
                .map(dishEntity -> {
                    DishResponseDTO dishResponseDTO = new DishResponseDTO();
                    dishResponseDTO.setId(dishEntity.getId());
                    dishResponseDTO.setName(dishEntity.getName());
                    return dishResponseDTO;
                }).collect(Collectors.toList());
        dto.setDishResponseDTOList(dishResponseDTOList);

        // Map Image Restaurant
        List<RestaurantImageDTO> restaurantImageDTOList = entity.getRestaurantImageEntityList()
                .stream()
                .map(image -> {
                    RestaurantImageDTO imageDTO = new RestaurantImageDTO();
                    imageDTO.setImageUrl(image.getImageUrl());
                    return imageDTO;
                }).collect(Collectors.toList());
        dto.setRestaurantImageDTOList(restaurantImageDTOList);

        // Map review
        List<ReviewDTO> reviewDTOS = entity.getReviewEntityList()
                .stream()
                .map(reviewEntity -> {
                    ReviewDTO reviewDTO = new ReviewDTO();
                    reviewDTO.setId(reviewEntity.getId());
                    reviewDTO.setComment(reviewEntity.getComment());
                    reviewDTO.setRating(reviewEntity.getRating());
                    reviewDTO.setCreateDate(reviewEntity.getCreateDate());
                    reviewDTO.setUsername(reviewEntity.getUserEntity() != null ? reviewEntity.getUserEntity().getUsername() : null);
                    return reviewDTO;
                }).collect(Collectors.toList());
        dto.setReviewDTOList(reviewDTOS);
        return dto;
    }
}