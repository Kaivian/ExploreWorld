package com.nomnomatlas.controller;

import com.nomnomatlas.model.RestaurantDTO;
import com.nomnomatlas.model.RestaurantsResponseDTO;
import com.nomnomatlas.service.RestaurantSearchService;
import com.nomnomatlas.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.List;

@RestController
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping(value="/api/city/{id}")  // trả về danh sách restaurant của city đó dựa id
    public List<RestaurantsResponseDTO> getAllRestaurantsByCityId(@PathVariable Integer id){
        return restaurantService.getAllRestaurantByCityId(id);
    }

    @GetMapping(value="/api/restaurants/{id}") // trả về thông tin của 1 restaurant dựa trên restaurantId
    public RestaurantDTO getRestaurantById(@PathVariable Integer id){
        return restaurantService.getRestaurantById(id);
    }

//    @GetMapping(value="/api/restaurants/search")
//    public List<RestaurantsResponseDTO> searchRestaurants(
//            @RequestParam(required = false) List<String> dish,
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime openTime,
//            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime closeTime
//    ){
//        return restaurantSearchService.searchRestaurants(dish, category, openTime, closeTime);
//    }

    @Autowired
    private RestaurantSearchService restaurantSearchService;

    @GetMapping(value="/api/restaurants/search")
    public List<RestaurantsResponseDTO> searchRestaurantsByDishName(
            @RequestParam(value="dishName") String dishName){
        return restaurantSearchService.searchRestaurantByNameDish(dishName);
    }
}