package a2.quanvda;

public class PCReport {
    private String blankString(int size) {
        final StringBuilder s = new StringBuilder();
        while (size-- > 0) s.append(" ");
        return s.toString();
    }

    private int length(final int num) {
        return String.valueOf(num).length();
    }

    private String pcToString(final PC pc) {
        final String sModel = this.blankString(20 - pc.getModel().length()) + pc.getModel();
        final String sYear = this.blankString(6 - this.length(pc.getYear())) + pc.getYear();
        final String sManu = this.blankString(15 - pc.getManufacturer().length()) + pc.getManufacturer();
        final StringBuilder sComps = new StringBuilder();
        sComps.append("[");
        for (int i = 0; i < pc.getComps().size(); i++) {
            sComps.append(pc.getComps().getElements().get(i));
            if (i < pc.getComps().getElements().size() - 1) {
                sComps.append(", ");
            }
        }
        sComps.append("]");

        return sModel + " " + sYear + " " + sManu + " " + sComps;
    }

    public String displayReport(final PC[] objs) {
        final StringBuilder result = new StringBuilder();
        result
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n')
                .append("                                           PCPROG REPORT                                           ")
                .append("\n")
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n');
        int i = 1;
        for (final PC pc : objs) {
            result.append(this.blankString(3 - this.length(i)) + i)
                    .append(" ")
                    .append(this.pcToString(pc))
                    .append("\n");
            i++;
        }
        result
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n');
        return result.toString();
    }
}
