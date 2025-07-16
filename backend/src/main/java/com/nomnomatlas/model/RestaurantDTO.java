package com.nomnomatlas.model;

import java.util.List;

public class RestaurantDTO {
    private Integer id;
    private String name;
    private String address;
    private String openTime;
    private String closingTime;
    private double latitude;
    private double longitude;
    private double rating;
    private String contactInfo;
    private List<RestaurantImageDTO> restaurantImageDTOList;
    private List<DishResponseDTO> dishResponseDTOList;
    private List<ReviewDTO> reviewDTOList;
    private String cityName;

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

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
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

    public List<RestaurantImageDTO> getRestaurantImageDTOList() {
        return restaurantImageDTOList;
    }

    public void setRestaurantImageDTOList(List<RestaurantImageDTO> restaurantImageDTOList) {
        this.restaurantImageDTOList = restaurantImageDTOList;
    }

    public List<DishResponseDTO> getDishResponseDTOList() {
        return dishResponseDTOList;
    }

    public void setDishResponseDTOList(List<DishResponseDTO> dishResponseDTOList) {
        this.dishResponseDTOList = dishResponseDTOList;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public List<ReviewDTO> getReviewDTOList() {
        return reviewDTOList;
    }

    public void setReviewDTOList(List<ReviewDTO> reviewDTOList) {
        this.reviewDTOList = reviewDTOList;
    }
}
