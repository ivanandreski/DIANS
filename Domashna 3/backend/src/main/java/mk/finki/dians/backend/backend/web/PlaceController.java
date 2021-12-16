package mk.finki.dians.backend.backend.web;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/{type}")
    public List<Place> findClosestOfType(@PathVariable String type,
                                         @RequestParam Double myLon,
                                         @RequestParam Double myLat,
                                         @RequestParam(required = false) Integer limit) {

        return placeService.findClosetOfType(type, myLon, myLat, limit);
    }

    @GetMapping("/all/{type}")
    public List<Place> findAllOfType(@PathVariable String type) {
        return placeService.findAllOfType(type);
    }

    @GetMapping("/search")
    public List<Place> findAllContainingSearchParameter(@RequestParam String param) {
        return placeService.findPlaceContainingSearchParameter(param);
    }

    @GetMapping()
    public ResponseEntity<Place> findById(@RequestParam Long id) {
        return placeService.findById(id)
                .map(place -> ResponseEntity.ok().body(place))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/radius/{type}")
    public List<Place> findClosestOfTypeWithinRadus(@PathVariable String type,
                                         @RequestParam Double myLon,
                                         @RequestParam Double myLat,
                                         @RequestParam Double radius) {

        return placeService.findClosetOfTypeInRadius(type, myLon, myLat, radius);
    }
}
