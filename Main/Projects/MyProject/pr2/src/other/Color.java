package other;

public enum Color {
    WHITE, BLUE, RED, GREEN;

    @Override
    public String toString() {
        switch (this) {
            case WHITE:
                return "#FFFFFF";
            case BLUE:
                return "#4c00d4";
            case RED:
                return "#c90000";
            case GREEN:
                return "#00ff00";
        }
        // Cannot reach
        return null;
    }
}
