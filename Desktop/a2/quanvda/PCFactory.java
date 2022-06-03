package a2.quanvda;

public class PCFactory {
    private static final PCFactory instance = new PCFactory();

    public static PCFactory getInstance() {
        return instance;
    }

    public PC createPC(String model,
                       int year,
                       String manufacturer,
                       Set<String> comps) {
        return new PC(model,
                year,
                manufacturer,
                comps);
    }
}
