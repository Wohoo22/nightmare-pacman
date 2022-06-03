package a2.quanvda;

public class PCReport {
    private String blankString(int size) {
        StringBuilder s = new StringBuilder();
        while (size-- > 0) s.append(" ");
        return s.toString();
    }

    private int length(int num) {
        return String.valueOf(num).length();
    }

    private String pcToString(PC pc) {
        String sModel = blankString(20 - pc.getModel().length()) + pc.getModel();
        String sYear = blankString(6 - length(pc.getYear())) + pc.getYear();
        String sManu = blankString(15 - pc.getManufacturer().length()) + pc.getManufacturer();
        StringBuilder sComps = new StringBuilder();
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

    public String displayReport(PC[] objs) {
        StringBuilder result = new StringBuilder();
        result
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n')
                .append("                                           PCPROG REPORT                                           ")
                .append("\n")
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n');
        int i = 1;
        for (PC pc : objs) {
            result.append(blankString(3 - length(i)) + i)
                    .append(" ")
                    .append(pcToString(pc))
                    .append("\n");
            i++;
        }
        result
                .append("---------------------------------------------------------------------------------------------------")
                .append('\n');
        return result.toString();
    }
}
