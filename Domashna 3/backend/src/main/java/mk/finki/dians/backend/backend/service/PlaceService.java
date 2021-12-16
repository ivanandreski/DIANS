package mk.finki.dians.backend.backend.service;

import mk.finki.dians.backend.backend.model.Place;

import java.util.List;
import java.util.Optional;

public interface PlaceService {
    List<Place> findAllOfType(String type);
    List<Place> findClosestOfType(String type, Double myLon, Double myLat, Integer limit);
    List<Place> findClosestOfTypeInRadius(String type, Double myLon, Double myLat, Double radius);
    List<Place> findPlaceContainingSearchParameter(String param);
    Optional<Place> findById(Long id);
}
