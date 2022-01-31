package mk.finki.dians.backend.backend.service.impl;

import mk.finki.dians.backend.backend.model.Place;
import mk.finki.dians.backend.backend.repository.PlaceRepository;
import mk.finki.dians.backend.backend.service.PlaceService;
import mk.finki.dians.backend.backend.utils.DistanceCalculator;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaceServiceImpl implements PlaceService {
    private final PlaceRepository placeRepository;
    private final DistanceCalculator distanceCalculator;

    public PlaceServiceImpl(PlaceRepository placeRepository, DistanceCalculator distanceCalculator) {
        this.placeRepository = placeRepository;
        this.distanceCalculator = distanceCalculator;
    }

    @Override
    public List<Place> findAllOfType(String type) {
        return placeRepository.findAllOfType(type);
    }

    @Override
    public List<Place> findClosestOfType(String type, Double myLon, Double myLat, Integer limit) {
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
    public List<Place> findClosestOfTypeInRadius(String type, Double myLon, Double myLat, Double radius) {
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
                        place.getName().toLowerCase().contains(convertCyrilicToLatin(param.toLowerCase())) ||
                        place.getName().toLowerCase().contains(convertLatinToCyrilic(param.toLowerCase())))
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

    public String convertCyrilicToLatin(String message){
        char[] abcCyr =   {' ','а','б','в','г','д','ѓ','е', 'ж','з','ѕ','и','ј','к','л','љ','м','н','њ','о','п','р','с','т', 'ќ','у', 'ф','х','ц','ч','џ','ш', 'А','Б','В','Г','Д','Ѓ','Е', 'Ж','З','Ѕ','И','Ј','К','Л','Љ','М','Н','Њ','О','П','Р','С','Т', 'Ќ', 'У','Ф', 'Х','Ц','Ч','Џ','Ш','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','/','-'};
        String[] abcLat = {" ","a","b","v","g","d","]","e","zh","z","y","i","j","k","l","q","m","n","w","o","p","r","s","t","'","u","f","h", "c",";", "x","{","A","B","V","G","D","}","E","Zh","Z","Y","I","J","K","L","Q","M","N","W","O","P","R","S","T","KJ","U","F","H", "C",":", "X","{", "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","/","-"};
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < message.length(); i++) {
            for (int x = 0; x < abcCyr.length; x++ ) {
                if (message.charAt(i) == abcCyr[x]) {
                    builder.append(abcLat[x]);
                    break;
                }
            }
        }
        return builder.toString();
    }

    public String convertLatinToCyrilic(String message){
        char[] abcCyr = {'а','б','ц','д','е','ф','г','х','и','ј','к','л','м','н','о','п','/','р','с','т','у','в','/','/','/','з'};
        char[] abcLat = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < message.length(); i++) {
            for (int x = 0; x < abcLat.length; x++ ) {
                if (message.charAt(i) == abcLat[x]) {
                    builder.append(abcCyr[x]);
                }
            }
            if(builder.length() != i+1)
                builder.append(message.charAt(i));
        }
        return builder.toString();
    }
}
