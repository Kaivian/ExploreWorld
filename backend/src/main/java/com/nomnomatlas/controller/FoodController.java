package com.nomnomatlas.controller;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FoodController {
    @Autowired
    private DishService dishService;
    @GetMapping(value="/api/dishes")
    public List<DishDTO> getDishByCityAndCategory(
                                @RequestParam(value="cityId") Integer cityId,
                                @RequestParam(value="category", required = false) String category){
        if(category != null && !category.isEmpty())
            return dishService.getDishByCityIdAndCategoryName(cityId, category);
        else
            return dishService.getDishByCityId(cityId);
    }
}
