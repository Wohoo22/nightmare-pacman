package other;

import java.util.HashSet;
import java.util.Set;

public class EventIntSet {
    private Set<Integer> set;

    public EventIntSet() {
        set = new HashSet<>();
    }

    public void add(int v) {
        if (v % 2 != 0) {
            throw new Error("Must be even.");
        }
        set.add(v);
    }

    public boolean contains(int v) {
        if (v % 2 != 0) {
            return false;
        }
        return set.contains(v);
    }

    public void remove(int v) {
        if (v % 2 != 0) {
            return;
        }
        set.remove(v);
    }
}
