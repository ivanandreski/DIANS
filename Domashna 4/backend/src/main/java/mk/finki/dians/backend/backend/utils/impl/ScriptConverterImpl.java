package mk.finki.dians.backend.backend.utils.impl;

import mk.finki.dians.backend.backend.utils.ScriptConverter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Locale;

@Component
public class ScriptConverterImpl implements ScriptConverter{

    String[] cyrillic = {"а", "б", "в", "г", "д", "ѓ", "е", "ж", "з", "ѕ", "и", "ј", "к", "л", "љ", "м",
            "н", "њ", "о", "п", "р", "с", "т", "ќ", "у", "ф", "х", "ц", "ч", "џ", "ш",
            "к", "в", "ј", "кс"};
    String[] latin = {"a", "b", "v", "g", "d", "gj", "e", "zh", "z", "dz", "i", "j", "k", "l", "lj", "m",
            "n", "nj", "o", "p", "r", "s", "t", "kj", "u", "f", "h", "c", "ch", "dj", "sh",
            "q", "w", "y", "x"};

    HashMap<String, String> latinToCyrillic;
    HashMap<String, String> cyrillicToLatin;
    Locale MK = new Locale("mk", "MK");

    public ScriptConverterImpl() {
        latinToCyrillic = new HashMap<String, String>();
        cyrillicToLatin = new HashMap<String, String>();

        for (int i = 0; i < cyrillic.length; ++i) {
            latinToCyrillic.put(latin[i], cyrillic[i]);
            cyrillicToLatin.put(cyrillic[i], latin[i]);
        }
    }

    public String convertCyrillicToLatin(String message) {
        return convertHelper(message, cyrillicToLatin, MK, Locale.US);
    }

    public String convertLatinToCyrillic(String message) {
        return convertHelper(message, latinToCyrillic, Locale.US, MK);
    }

    private String convertHelper(String message, HashMap<String, String> map, Locale fromLocale, Locale toLocale) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0 ; i < message.length(); i++) {
            if (i < message.length() - 1) {
                String subStr = message.substring(i, i+2);
                if (map.containsKey(subStr)) {
                    builder.append(map.get(subStr));
                    ++i;
                    continue;
                }
                subStr = subStr.toLowerCase(fromLocale);
                if (map.containsKey(subStr)) {
                    builder.append(map.get(subStr).toUpperCase(toLocale));
                    ++i;
                    continue;
                }
            }
            String subStr = message.substring(i, i+1);
            if (map.containsKey(subStr)) {
                builder.append(map.get(subStr));
                continue;
            }
            subStr = subStr.toLowerCase(fromLocale);
            if (map.containsKey(subStr)) {
                builder.append(map.get(subStr).toUpperCase(toLocale));
                continue;
            }
            builder.append(message.charAt(i));
        }
        return builder.toString();
    }
}
