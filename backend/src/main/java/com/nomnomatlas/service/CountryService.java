package com.nomnomatlas.service;

import com.nomnomatlas.model.CityDTO;
import com.nomnomatlas.model.CountryDTO;
import com.nomnomatlas.repository.CountryRepository;
import com.nomnomatlas.repository.entity.CountryEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {
    @Autowired
    CountryRepository countryRepository;

    private CountryDTO convertToCountryDTO(CountryEntity countryEntity){
        List<CityDTO> cityDTOS = countryEntity.getCityEntityList().stream().map(city -> {
            CityDTO cityDTO = new CityDTO();
            cityDTO.setName(city.getName());
            cityDTO.setCityId(city.getId());
            return cityDTO;
        }).collect(Collectors.toList());

        CountryDTO countryDTO = new CountryDTO();
        countryDTO.setCountryId(countryEntity.getId());
        countryDTO.setName(countryEntity.getName());
        countryDTO.setCities(cityDTOS);

        return countryDTO;
    }

    public List<CountryDTO> getAllCountriesWithCities(){
        List<CountryEntity> countries = countryRepository.findAllWithCities();
        return countries.stream().map(this::convertToCountryDTO).toList();
    }
}
