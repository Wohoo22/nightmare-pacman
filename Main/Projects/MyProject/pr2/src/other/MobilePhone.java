package other;

public class MobilePhone {
    private String manName;
    private String model;
    private Color color;
    private int year;
    private boolean guaranteed;
    private String colorCode;

    public MobilePhone(String model, Color color, int year, boolean guaranteed) {
        this.manName = manName;
        validateModel(model);
        this.model = model;
        this.color = color;
        this.year = year;
        this.colorCode = color.toString();
    }


    private static void validateModel(String model) {
        if (model.length() != 9) {
            throw new Error("Invalid model length.");
        }
        if (model.charAt(0) != 'M' || model.charAt(1) != '-' || model.charAt(5) != '-') {
            throw new Error("Invalid model format.");
        }
        for (int i = 2; i <= 4; i++) {
            if (!Character.isAlphabetic(model.charAt(i))) {
                throw new Error("Char at " + i + " must be an alphabet.");
            }
        }
        for (int i = 6; i <= 8; i++) {
            if (!Character.isDigit(model.charAt(i))) {
                throw new Error("Char at " + i + " must be a digit.");
            }
        }
    }

    public void setManName(String manName) {
        this.manName = manName;
    }

    public void endGuarantee() {
        this.guaranteed = false;
    }

    public String getManName() {
        return manName;
    }

    public String getModel() {
        return model;
    }

    public Color getColor() {
        return color;
    }

    public int getYear() {
        return year;
    }

    public boolean isGuaranteed() {
        return guaranteed;
    }

    @Override
    public String toString() {
        return "other.MobilePhone{" +
                "manName='" + manName + '\'' +
                ", model='" + model + '\'' +
                ", color=" + color +
                ", year=" + year +
                ", guaranteed=" + guaranteed +
                ", colorCode='" + colorCode + '\'' +
                '}';
    }
}


