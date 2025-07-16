
package com.nomnomatlas.repository.entity;

import com.nomnomatlas.model.DishDTO;
import com.nomnomatlas.model.RestaurantImageDTO;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="restaurant")
public class RestaurantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="address", nullable = false)
    private String address;

    @Column(name="opening_time")
    private LocalTime openTime;

    @Column(name="closing_time")
    private LocalTime closingTime;

    @Column(name="latitude", nullable = false)
    private double latitude;

    @Column(name="longitude", nullable = false)
    private double longitude;

    @Column(name="rating")
    private double rating;

    @Column(name="contact_info")
    private String contactInfo;

    @OneToMany(mappedBy = "restaurantEntity", fetch = FetchType.LAZY)
    private List<ReviewEntity> reviewEntityList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private CityEntity cityEntity;

    @ManyToMany
    @JoinTable(
            name = "restaurant_dish",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "dish_id")
    )
    private List<DishEntity> dishEntityList = new ArrayList<>();

    @OneToMany(mappedBy = "restaurantEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL )
    private List<RestaurantImageEntity> restaurantImageEntityList = new ArrayList<>();

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<ReviewEntity> getReviewEntityList() {
        return reviewEntityList;
    }

    public void setReviewEntityList(List<ReviewEntity> reviewEntityList) {
        this.reviewEntityList = reviewEntityList;
    }

    public List<RestaurantImageEntity> getRestaurantImageEntityList() {
        return restaurantImageEntityList;
    }

    public void setRestaurantImageEntityList(List<RestaurantImageEntity> restaurantImageEntityList) {
        this.restaurantImageEntityList = restaurantImageEntityList;
    }

    public CityEntity getCityEntity() {
        return cityEntity;
    }

    public void setCityEntity(CityEntity cityEntity) {
        this.cityEntity = cityEntity;
    }

    public List<DishEntity> getDishEntityList() {
        return dishEntityList;
    }

    public void setDishEntityList(List<DishEntity> dishEntityList) {
        this.dishEntityList = dishEntityList;
    }
}
