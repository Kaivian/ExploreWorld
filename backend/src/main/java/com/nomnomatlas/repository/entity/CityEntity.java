package com.nomnomatlas.repository.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="city")
public class CityEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(name="name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private CountryEntity countryEntity;

    @OneToMany(mappedBy = "cityEntity", fetch = FetchType.LAZY)
    private List<DishEntity> dishEntityList = new ArrayList<>();

    @OneToMany(mappedBy = "cityEntity", fetch = FetchType.LAZY)
    private List<RestaurantEntity> restaurantEntityList = new ArrayList<>();

    public List<DishEntity> getDishEntityList() {
        return dishEntityList;
    }

    public void setDishEntityList(List<DishEntity> dishEntityList) {
        this.dishEntityList = dishEntityList;
    }

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CountryEntity getCountryEntity() {
        return countryEntity;
    }

    public void setCountryEntity(CountryEntity countryEntity) {
        this.countryEntity = countryEntity;
    }

    public List<RestaurantEntity> getRestaurantEntityList() {
        return restaurantEntityList;
    }

    public void setRestaurantEntityList(List<RestaurantEntity> restaurantEntityList) {
        this.restaurantEntityList = restaurantEntityList;
    }
}
