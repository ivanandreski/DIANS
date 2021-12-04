package mk.finki.dians.backend.backend.service;

import mk.finki.dians.backend.backend.model.Place;

import java.util.List;

public interface PlaceService {
    List<Place> findAllOfType(String type);
    List<Place> findClosetFiveOfType(String type, Double myLon, Double myLat);
}
