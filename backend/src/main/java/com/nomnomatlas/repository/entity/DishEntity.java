package com.nomnomatlas.repository.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="dish")
public class DishEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="name")
    private String name;

    @Column(name="video_url")
    private String videoUrl;

    @Column(name="has_manual_story")
    private String hasManualStory;

    @Column(name="featured")
    private String feature;

    @Column(name="history")
    private String history;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private CityEntity cityEntity;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity categoryEntity;

    @ManyToMany(mappedBy = "dishEntityList")
    private List<RestaurantEntity> restaurantEntityList = new ArrayList<>();

    public List<RestaurantEntity> getRestaurantEntityList() {
        return restaurantEntityList;
    }

    public void setRestaurantEntityList(List<RestaurantEntity> restaurantEntityList) {
        this.restaurantEntityList = restaurantEntityList;
    }

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

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getHasManualStory() {
        return hasManualStory;
    }

    public void setHasManualStory(String hasManualStory) {
        this.hasManualStory = hasManualStory;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public CityEntity getCityEntity() {
        return cityEntity;
    }

    public void setCityEntity(CityEntity cityEntity) {
        this.cityEntity = cityEntity;
    }

    public CategoryEntity getCategoryEntity() {
        return categoryEntity;
    }

    public void setCategoryEntity(CategoryEntity categoryEntity) {
        this.categoryEntity = categoryEntity;
    }
}
