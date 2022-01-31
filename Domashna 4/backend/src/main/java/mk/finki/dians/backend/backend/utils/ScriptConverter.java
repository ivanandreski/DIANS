package mk.finki.dians.backend.backend.utils;

public interface ScriptConverter {
    String convertCyrilicToLatin(String message);
    String convertLatinToCyrilic(String message);
}
