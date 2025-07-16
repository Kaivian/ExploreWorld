package com.nomnomatlas.controller;

import com.nomnomatlas.model.CountryDTO;
import com.nomnomatlas.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CountryController {
    @Autowired
    CountryService countryService;  // Trả về danh sách country và city của country đó
    @GetMapping(value="/api/countries")
    public List<CountryDTO> getAllCountriesWithCities(){
        return countryService.getAllCountriesWithCities();
    }
}
