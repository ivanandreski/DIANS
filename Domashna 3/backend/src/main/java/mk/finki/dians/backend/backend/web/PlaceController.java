package mk.finki.dians.backend.backend.web;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.service.PlaceService;
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
    public List<Place> findClosestOfType(@PathVariable String type, @RequestParam Double myLon, @RequestParam Double myLat) {
        return placeService.findClosetFiveOfType(type, myLon, myLat);
    }

    @GetMapping("/all/{type}")
    public List<Place> findAllOfType(@PathVariable String type) {
        return placeService.findAllOfType(type);
    }

    @GetMapping("/search")
    public List<Place> findAllContainingSearchParameter(@RequestParam String searchParameter) {
        return placeService.findPlaceContainingSearchParameter(searchParameter);
    }
}
