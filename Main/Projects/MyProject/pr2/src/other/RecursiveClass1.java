package other;

import java.util.ArrayList;
import java.util.List;

public class RecursiveClass1 {
    private final int value;
    private final List<RecursiveClass1> statesStruc;

    public RecursiveClass1(int maxValue) {
        if (maxValue == 0) {
            this.value = maxValue;
            this.statesStruc = new ArrayList<>();
            return;
        }
        value = maxValue;
        statesStruc = new ArrayList<>();

        RecursiveClass1 before = new RecursiveClass1(maxValue - 2);

        statesStruc.addAll(before.statesStruc);
        statesStruc.add(this);
    }

    public int getValue() {
        return value;
    }
}
