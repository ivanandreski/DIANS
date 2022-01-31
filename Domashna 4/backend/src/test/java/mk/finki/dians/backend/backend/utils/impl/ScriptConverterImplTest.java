package mk.finki.dians.backend.backend.utils.impl;

import mk.finki.dians.backend.backend.utils.ScriptConverter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

class ScriptConverterImplTest {

    ScriptConverter scriptConverter;

    @BeforeEach
    public void setUp(){
        scriptConverter = new ScriptConverterImpl();
    }

    @Test
    void convertCyrillicToLatin() {
        String result = scriptConverter.convertCyrillicToLatin("Тест");
        Assert.isTrue(result.equals("Test"),String.format("CyrillicToLatin Test failed. Expected: Test. Received: %s.",result));
    }

    @Test
    void convertLatinToCyrillic() {
        String result = scriptConverter.convertLatinToCyrillic("Test");
        Assert.isTrue(result.equals("Тест"),String.format("LatinToCyrillic Test failed. Expected: Тест. Received: %s.",result));
    }

    @Test
    void convertLatinToCyrillicWithSpecialCharacters(){
        String result = scriptConverter.convertLatinToCyrillic("LA MER - Coffe & Wine bar");
        Assert.isTrue(result.equals("ЛА МЕР - Цоффе & Вине бар"),String.format("LatinToCyrillic Test failed. Expected: ЛА МЕР - Цоффе & Вине бар. Received: %s.",result));
    }

    @Test
    void convertCyrillicToLatinWithSpecialCharacters(){
        String result = scriptConverter.convertCyrillicToLatin("ЛА МЕР - Цоффе & Вине бар");
        Assert.isTrue(result.equals("LA MER - Coffe & Wine bar"),String.format("CyrillicToLatin Test failed. Expected: LA MER - Coffe & Wine bar. Received: %s.",result));
    }
}