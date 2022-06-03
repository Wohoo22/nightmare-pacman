package a2.quanvda;

import utils.DomainConstraint;

public class PC {

    @DomainConstraint(mutable = true, optional = false, length = 20)
    private String model;
    @DomainConstraint(mutable = false, optional = false, min = 1984)
    private int year;
    @DomainConstraint(mutable = false, optional = false, length = 15)
    private String manufacturer;
    @DomainConstraint(mutable = true, optional = false)
    private Set<String> comps;

    public PC(String model,
              int year,
              String manufacturer,
              Set<String> comps) {
        this.model = model;
        this.year = year;
        this.manufacturer = manufacturer;
        this.comps = comps;
    }

    @Override
    public String toString() {
        return "PC<" + model + "," + year + "," + manufacturer + "," + "Set{" + compsToString() + "}>";
    }

    private String compsToString() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i < comps.size(); i++) {
            s.append(comps.getElements().get(i));
            if (i < comps.size() - 1)
                s.append(",");
        }
        return s.toString();
    }

    @Override
    public boolean equals(Object obj) {
        if ((obj instanceof PC) == false)
            return false;
        PC other = (PC) obj;
        if (this.model.equals(other.model) == false
                || this.year != other.year
                || this.manufacturer.equals(other.manufacturer) == false
                || this.comps.size() != other.comps.size())
            return false;
        for (String thisComp : this.comps.getElements())
            if (other.comps.isIn(thisComp) == false)
                return false;
        return true;
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public Set<String> getComps() {
        return comps;
    }
}
