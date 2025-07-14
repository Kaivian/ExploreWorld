package com.nomnomatlas.service;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.repository.DishRepository;
import com.nomnomatlas.repository.entity.DishEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {
    @Autowired
    DishRepository dishRepository;

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
