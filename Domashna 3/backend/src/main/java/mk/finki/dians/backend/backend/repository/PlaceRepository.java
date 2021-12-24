package mk.finki.dians.backend.backend.repository;

import mk.finki.dians.backend.backend.model.Place;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

@Repository
public class PlaceRepository {
    private final String databasePath = "./database";

    public List<Place> findAllOfType(String type) {
        List<Place> allPlaces = new ArrayList<>();
        String path = String.format("%s/%s.csv", databasePath, type);
        File file = new File(path);
        try {
            BufferedReader bf = new BufferedReader(new FileReader(file));
            String line = bf.readLine();
            while ((line = bf.readLine()) != null) {
                String[] placeArray = line.split(",");
                allPlaces.add(Place.placeFactory(placeArray, type));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return allPlaces;
    }

    public List<Place> findAll() {
        List<Place> allPlaces = new ArrayList<>();
        File file = new File(databasePath);
        Arrays.stream(file.listFiles())
                .forEach(f -> {
                    try {
                        BufferedReader bf = new BufferedReader(new FileReader(f));
                        String line = bf.readLine();
                        while ((line = bf.readLine()) != null) {
                            String[] placeArray = line.split(",");
                            allPlaces.add(Place.placeFactory(placeArray, f.getName().replaceAll(".csv", "")));
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });

        return allPlaces;
    }
}