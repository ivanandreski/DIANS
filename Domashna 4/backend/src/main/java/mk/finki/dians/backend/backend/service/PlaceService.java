package mk.finki.dians.backend.backend.service;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.model.enumerations.LocationType;

import java.util.List;
import java.util.Optional;

public interface PlaceService {
    List<Place> findAllOfType(LocationType type);
    List<Place> findClosestOfType(LocationType type, Double myLon, Double myLat, Integer limit);
    List<Place> findClosestOfTypeInRadius(LocationType type, Double myLon, Double myLat, Double radius);
    List<Place> findPlaceContainingSearchParameter(String param);
    Optional<Place> findById(Long id);
}