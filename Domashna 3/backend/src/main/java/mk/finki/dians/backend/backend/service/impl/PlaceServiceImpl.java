package mk.finki.dians.backend.backend.service.impl;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.repository.PlaceRepository;
import mk.finki.dians.backend.backend.service.PlaceService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;

    public PlaceServiceImpl(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @Override
    public List<Place> findAllOfType(String type) {
        return placeRepository.findAllOfType(type);
    }

    @Override
    public List<Place> findClosestOfType(String type, Double myLon, Double myLat, Integer limit) {
        List<Place> places = placeRepository.findAllOfType(type)
                .stream()
                .sorted(Comparator.comparing(place -> this.distanceInKilometers(myLon, myLat, place.getLon(), place.getLat())))
                .collect(Collectors.toList());

        if(limit != null)
            return places.stream().limit(limit).collect(Collectors.toList());
        else
            return places;
    }

    @Override
    public List<Place> findClosestOfTypeInRadius(String type, Double myLon, Double myLat, Double radius) {
        return placeRepository.findAllOfType(type)
                .stream()
                .filter(place -> this.distanceInKilometers(myLon, myLat, place.getLon(), place.getLat()) < radius)
                .collect(Collectors.toList());
    }

    @Override
    public List<Place> findPlaceContainingSearchParameter(String param) {
        return placeRepository.findAll()
                .stream()
                .filter(place -> place.getName().toLowerCase().contains(param.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Place> findById(Long id) {
        return placeRepository.findAll()
                .stream()
                .filter(place -> place.getId().equals(id))
                .findFirst();
    }

    private double distanceInKilometers(double lon1, double lat1, double lon2, double lat2) {
        // distance between latitudes and longitudes
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // convert to radians
        lat1 = Math.toRadians(lat1);
        lat2 = Math.toRadians(lat2);

        // apply formulae
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                        Math.cos(lat1) *
                        Math.cos(lat2);
        double rad = 6371;
        double c = 2 * Math.asin(Math.sqrt(a));
        return rad * c;
    }
}
