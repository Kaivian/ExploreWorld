package com.nomnomatlas.controller;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DishController {
    @Autowired
    private DishService dishService;

    @GetMapping(value="/api/dish/{id}")
    public DishDTO getDishById(@PathVariable Integer id){
        return dishService.getDishById(id);
    }
}
