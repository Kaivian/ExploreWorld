package com.nomnomatlas.service;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.model.DishImageDTO;
import com.nomnomatlas.repository.DishRepository;
import com.nomnomatlas.repository.entity.DishEntity;
import com.nomnomatlas.repository.entity.DishImageEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {
    @Autowired
    DishRepository dishRepository;

    public DishDTO getDishById(Integer id){
        DishEntity dishEntity = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found"));
        DishDTO dishDTO = new DishDTO();
        dishDTO.setId(dishEntity.getId());
        dishDTO.setName(dishEntity.getName());
        dishDTO.setHasManualStory(dishEntity.getHasManualStory());
        dishDTO.setFeature(dishEntity.getFeature());
        dishDTO.setHistory(dishEntity.getHistory());
        dishDTO.setVideoUrl(dishEntity.getVideoUrl());
        dishDTO.setCityName(dishEntity.getCityEntity() != null ? dishEntity.getCityEntity().getName() : null);
        dishDTO.setCategoryName(dishEntity.getCategoryEntity() != null ? dishEntity.getCategoryEntity().getName() : null);
        List<DishImageDTO> dishImageDTOList = dishEntity.getDishImageEntityList()
                .stream()
                .map(dishImageEntity -> {
                    DishImageDTO dishImageDTO = new DishImageDTO();
                    dishImageDTO.setImageUrl(dishImageEntity.getImageURL());
                    return dishImageDTO;
                }).collect(Collectors.toList());
        dishDTO.setDishImageDTOList(dishImageDTOList);
        return dishDTO;
    }

    public List<DishDTO> getDishByCityId(Integer cityId){
        List<DishEntity> dishEntityList = dishRepository.findAllByCityEntityId(cityId);
        return dishEntityList.stream().map(dishEntity -> {
            DishDTO dishDTO = new DishDTO();
            dishDTO.setId(dishEntity.getId());
            dishDTO.setName(dishEntity.getName());
            dishDTO.setVideoUrl(dishEntity.getVideoUrl());
            dishDTO.setHasManualStory(dishEntity.getHasManualStory());
            dishDTO.setFeature(dishEntity.getFeature());
            dishDTO.setHistory(dishEntity.getHistory());
            dishDTO.setCategoryName(dishEntity.getCategoryEntity().getName());
            dishDTO.setCityName(dishEntity.getCityEntity().getName());
            return dishDTO;
        }).collect(Collectors.toList());
    }

    public List<DishDTO> getDishByCityIdAndCategoryName(Integer cityId, String categoryName){
        List<DishEntity> dishEntityList = dishRepository.findAllByCityEntityIdAndCategoryEntityName(cityId, categoryName);
        return dishEntityList.stream().map(dishEntity -> {
            DishDTO dishDTO = new DishDTO();
            dishDTO.setId(dishEntity.getId());
            dishDTO.setName(dishEntity.getName());
            dishDTO.setVideoUrl(dishEntity.getVideoUrl());
            dishDTO.setHasManualStory(dishEntity.getHasManualStory());
            dishDTO.setFeature(dishEntity.getFeature());
            dishDTO.setHistory(dishEntity.getHistory());
            dishDTO.setCategoryName(dishEntity.getCategoryEntity().getName());
            dishDTO.setCityName(dishEntity.getCityEntity().getName());
            return dishDTO;
        }).collect(Collectors.toList());
    }
}
