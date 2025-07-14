package com.nomnomatlas.repository.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="country")
public class CountryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy = "countryEntity", fetch = FetchType.LAZY)
    private List<CityEntity> cityEntityList = new ArrayList<>();

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

    public List<CityEntity> getCityEntityList() {
        return cityEntityList;
    }

    public void setCityEntityList(List<CityEntity> cityEntityList) {
        this.cityEntityList = cityEntityList;
    }
}
