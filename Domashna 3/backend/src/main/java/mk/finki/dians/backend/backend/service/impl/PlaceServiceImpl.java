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
    public List<Place> findClosetFiveOfType(String type, Double myLon, Double myLat) {
        return placeRepository.findAllOfType(type)
                .stream()
                .sorted(Comparator.comparing(place -> this.distance(myLon, myLat, place.getLon(), place.getLat())))
                .limit(5)
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

    private double distance(double lon1, double lat1, double lon2, double lat2) {
        double theta = lon1 - lon2;
        double dist = Math.sin(deg2rad(lat1))
                * Math.sin(deg2rad(lat2))
                + Math.cos(deg2rad(lat1))
                * Math.cos(deg2rad(lat2))
                * Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist * 60 * 1.1515;
        return (dist);
    }

    private double deg2rad(double deg) {
        return (deg * Math.PI / 180.0);
    }

    private double rad2deg(double rad) {
        return (rad * 180.0 / Math.PI);
    }
}
