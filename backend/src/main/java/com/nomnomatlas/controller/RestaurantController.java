package com.nomnomatlas.controller;

import com.nomnomatlas.model.RestaurantDTO;
import com.nomnomatlas.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @GetMapping(value="/api/restaurants")
    public List<RestaurantDTO> getAllRestaurantByCityId(@RequestParam(value="cityId") Integer cityId){
        return restaurantService.getAllRestaurantByCityId(cityId);
    }

    
}
