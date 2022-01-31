package mk.finki.dians.backend.backend.web;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.model.enumerations.LocationType;
import mk.finki.dians.backend.backend.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/place")
@CrossOrigin
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/{type}")
    @CrossOrigin
    public List<Place> findClosestOfType(@PathVariable String type,
                                         @RequestParam Double myLon,
                                         @RequestParam Double myLat,
                                         @RequestParam(required = false) Integer limit) {

        return placeService.findClosestOfType(LocationType.valueOf(type.toUpperCase(Locale.US)), myLon, myLat, limit);
    }

    @GetMapping("/all/{type}")
    @CrossOrigin
    public List<Place> findAllOfType(@PathVariable String type) {
        return placeService.findAllOfType(LocationType.valueOf(type.toUpperCase(Locale.US)));
    }

    @GetMapping("/search")
    public List<Place> findAllContainingSearchParameter(@RequestParam String param) {
        return placeService.findPlaceContainingSearchParameter(param);
    }

    @GetMapping()
    @CrossOrigin
    public ResponseEntity<Place> findById(@RequestParam Long id) {
        return placeService.findById(id)
                .map(place -> ResponseEntity.ok().body(place))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/radius/{type}")
    @CrossOrigin
    public List<Place> findClosestOfTypeWithinRadius(@PathVariable String type,
                                                    @RequestParam Double myLon,
                                                    @RequestParam Double myLat,
                                                    @RequestParam Double radius) {

        return placeService.findClosestOfTypeInRadius(LocationType.valueOf(type.toUpperCase(Locale.US)), myLon, myLat, radius);
    }
}
