package a2.quanvda;

import utils.DomainConstraint;

public class PC {

    @DomainConstraint(mutable = true, optional = false, length = 20)
    private final String model;
    @DomainConstraint(mutable = false, optional = false, min = 1984)
    private final int year;
    @DomainConstraint(mutable = false, optional = false, length = 15)
    private final String manufacturer;
    @DomainConstraint(mutable = true, optional = false)
    private final Set<String> comps;

    public PC(final String model,
              final int year,
              final String manufacturer,
              final Set<String> comps) {
        this.model = model;
        this.year = year;
        this.manufacturer = manufacturer;
        this.comps = comps;
    }

    @Override
    public String toString() {
        return "PC<" + this.model + "," + this.year + "," + this.manufacturer + "," + "Set{" + this.compsToString() + "}>";
    }

    private String compsToString() {
        final StringBuilder s = new StringBuilder();
        for (int i = 0; i < this.comps.size(); i++) {
            s.append(this.comps.getElements().get(i));
            if (i < this.comps.size() - 1)
                s.append(",");
        }
        return s.toString();
    }

    @Override
    public boolean equals(final Object obj) {
        if ((obj instanceof PC) == false)
            return false;
        final PC other = (PC) obj;
        if (model.equals(other.model) == false
                || year != other.year
                || manufacturer.equals(other.manufacturer) == false
                || comps.size() != other.comps.size())
            return false;
        for (final String thisComp : comps.getElements())
            if (other.comps.isIn(thisComp) == false)
                return false;
        return true;
    }

    public String getModel() {
        return this.model;
    }

    public int getYear() {
        return this.year;
    }

    public String getManufacturer() {
        return this.manufacturer;
    }

    public Set<String> getComps() {
        return this.comps;
    }
}
