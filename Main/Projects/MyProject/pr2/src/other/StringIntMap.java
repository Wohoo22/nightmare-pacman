package other;

import java.util.HashMap;
import java.util.Map;

public class StringIntMap {
    private Map<String, Integer> map;

    public StringIntMap() {
        map = new HashMap<>();
    }

    Integer get(String k) {
        return map.get(k);
    }

    void add(String k, Integer v) {
        map.put(k, v);
    }

    void remove(String k) {
        map.remove(k);
    }
}
