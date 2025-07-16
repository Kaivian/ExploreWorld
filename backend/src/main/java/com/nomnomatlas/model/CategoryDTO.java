package com.nomnomatlas.model;

import java.util.List;

public class CategoryDTO {
    private Integer id;
    private String name;
    private List<DishDTO> dishDTOList;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<DishDTO> getDishDTOList() {
        return dishDTOList;
    }

    public void setDishDTOList(List<DishDTO> dishDTOList) {
        this.dishDTOList = dishDTOList;
    }
}