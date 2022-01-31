package mk.finki.dians.backend.backend.service.impl;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.model.enumerations.LocationType;
import mk.finki.dians.backend.backend.repository.PlaceRepository;
import mk.finki.dians.backend.backend.service.PlaceService;
import mk.finki.dians.backend.backend.utils.DistanceCalculator;
import mk.finki.dians.backend.backend.utils.ScriptConverter;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;
    private final DistanceCalculator distanceCalculator;
    private final ScriptConverter scriptConverter;

    public PlaceServiceImpl(PlaceRepository placeRepository, DistanceCalculator distanceCalculator, ScriptConverter scriptConverter) {
        this.placeRepository = placeRepository;
        this.distanceCalculator = distanceCalculator;
        this.scriptConverter = scriptConverter;
    }

    @Override
    public List<Place> findAllOfType(LocationType type) {
        return placeRepository.findAllOfType(type);
    }

    @Override
    public List<Place> findClosestOfType(LocationType type, Double myLon, Double myLat, Integer limit) {
        List<Place> places = placeRepository.findAllOfType(type)
                .stream()
                .sorted(Comparator.comparing(place -> this.distanceCalculator.distanceInKilometers(myLon, myLat, place.getLon(), place.getLat())))
                .collect(Collectors.toList());

        if(limit != null)
            return places.stream().limit(limit).collect(Collectors.toList());
        else
            return places;
    }

    @Override
    public List<Place> findClosestOfTypeInRadius(LocationType type, Double myLon, Double myLat, Double radius) {
        return placeRepository.findAllOfType(type)
                .stream()
                .filter(place -> this.distanceCalculator.distanceInKilometers(myLon, myLat, place.getLon(), place.getLat()) < radius)
                .collect(Collectors.toList());
    }

    @Override
    public List<Place> findPlaceContainingSearchParameter(String param) {
        return placeRepository.findAll()
                .stream()
                .filter(place -> place.getName().toLowerCase().contains(param.toLowerCase()) ||
                        place.getName().toLowerCase().contains(scriptConverter.convertCyrillicToLatin(param.toLowerCase())) ||
                        place.getName().toLowerCase().contains(scriptConverter.convertLatinToCyrillic(param.toLowerCase())))
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Place> findById(Long id) {
        return placeRepository.findAll()
                .stream()
                .filter(place -> place.getId().equals(id))
                .findFirst();
    }

}
