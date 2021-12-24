package mk.finki.dians.backend.backend.model;

import lombok.Data;

@Data
public class Place {
    private Long id;
    private Double lon;
    private Double lat;
    private String name;
    private String type;

    public Place(Long id, Double lon, Double lat, String name, String type) {
        this.id = id;
        this.lon = lon;
        this.lat = lat;
        this.name = name;
        this.type = type;
    }

    public static Place placeFactory(String[] csvString, String type) {
        Long id = Long.parseLong(csvString[0]);
        Double longitude = Double.parseDouble(csvString[1]);
        Double latitude = Double.parseDouble(csvString[2]);
        String name;
        if(csvString.length == 3) {
            name = "Unknown";
        }
        else {
            name = csvString[3];
        }

        return new Place(id, longitude, latitude, name, type);
    }
}