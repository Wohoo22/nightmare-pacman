package a2.quanvda;

public class PCFactory {
    private static final PCFactory instance = new PCFactory();

    public static PCFactory getInstance() {
        return PCFactory.instance;
    }

    public PC getPC(final String model,
                    final int year,
                    final String manufacturer,
                    final Set<String> comps) {
        return new PC(model,
                year,
                manufacturer,
                comps);
    }
}
