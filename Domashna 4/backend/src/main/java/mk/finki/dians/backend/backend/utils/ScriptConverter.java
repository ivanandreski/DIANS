package mk.finki.dians.backend.backend.utils;

public interface ScriptConverter {
    String convertCyrillicToLatin(String message);
    String convertLatinToCyrillic(String message);
}
