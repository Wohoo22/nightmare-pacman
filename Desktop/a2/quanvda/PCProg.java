package a2.quanvda;

import utils.DomainConstraint;
import utils.NotPossibleException;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Vector;

import static utils.TextIO.*;

/**
 * @overview PCProg is a program that captures data about PC objects
 * and displays a report about them on the console.
 * @attributes objs  Set<PC>
 * @object A typical PCProg is {c1,...,cn} where c1,...,cn are pcs
 * @abstract_properties mutable(objs)=true /\ optional(objs)=false
 */
public class PCProg {
    @DomainConstraint(mutable = true, optional = false)
    private Set<PC> objs;

    /**
     * @effects initialise this to have an empty set of PCs
     */
    public PCProg() {
        objs = new Set<>();
    }

    /**
     * @effects if objs is not empty
     * display to the standard console a text-based tabular report on objs
     * return this report
     * else
     * display nothing and return null
     */
    public String displayReport() {
        if (objs.size() > 0) {
            Vector<PC> pcs = objs.getElements();

            PCReport reportObj = new PCReport();
            return reportObj.displayReport(pcs.toArray(new PC[pcs.size()]));
        } else {
            return null;
        }
    }

    /**
     * @effects save report to a file pcs.txt in the same directory
     * as the program's
     */
    public void saveReport(String report) {
        String fileName = "pcs.txt";
        writeFile(fileName);
        putln(report);
        writeStandardOutput();
    }

    public void createObjects() {
        while (true) {
            putln("Enter new PC:");
            List<String> props = new ArrayList<>();
            while (true) {
                String s = getln();
                putln();
                if (s.isEmpty()) break;
                else props.add(s);
            }
            Set<String> comps = new Set<>();
            for (int i = 3; i < props.size(); i++) comps.insert(props.get(i));
            objs.insert(
                    PCFactory.getInstance().createPC(
                            props.get(0),
                            Integer.valueOf(props.get(1)),
                            props.get(2),
                            comps
                    )
            );
            putln("Create new PC? [Y/N]");
            if (getln().equals("N"))
                break;
        }
    }

    public Set<PC> getObjects() {
        return objs;
    }

    /**
     * The run method
     *
     * @effects initialise an instance of PCProg
     * create objects from data entered by the user
     * display a report on the objects
     * prompt user to save report to file
     * if user answers "Y"
     * save report
     * else
     * end
     */
    public static void main(String[] args) {
        //
        PCProg prog = new PCProg();

        // create objects
        try {
            prog.createObjects();
            // display report
            String report = prog.displayReport();

            if (report != null) {
                // prompt user to save report
                putln("Save report to file? [Y/N]");
                String toSave = getln();
                if (toSave.equals("Y")) {
                    prog.saveReport(report);
                    putln("report saved");
                }
            }
        } catch (NotPossibleException e) {
            e.printStackTrace();
            System.err.printf("%s: %s%n", e, e.getMessage());
        }

        putln("~END~");
    }
}
