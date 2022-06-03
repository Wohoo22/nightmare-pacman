package a2.quanvda;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class Test {
    public static void main(String[] args) throws FileNotFoundException {
        PCTest.run();
        PCFactoryTest.run();
        PCReportTest.run();
        PCProgTest.run();
        System.out.println("All tests passed, you are so fucking handsome, i love you <3");
    }

    private static void check(boolean b) {
        if (!b) throw new RuntimeException("Oh shit wrong answer!");
    }

    private static class PCTest {
        private static void run() {
            toStringTest();
            equalsTest();
            createTest();
        }

        private static void createTest() {
            Set<String> comps = new Set<>();
            comps.insert("AMD Ryzen 5");
            comps.insert("8GB DDR4");
            comps.insert("512GB SSD");
            comps.insert("NVIDIA MX450");
            PC pc = new PC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps
            );

            check(pc.getModel().equals("Thinkpad X1 Carbon"));
            check(pc.getYear() == 2022);
            check(pc.getManufacturer().equals("Lenovo"));
            check(pc.getComps().size() == comps.size());
            check(pc.getComps().isIn("AMD Ryzen 5"));
            check(pc.getComps().isIn("8GB DDR4"));
            check(pc.getComps().isIn("512GB SSD"));
            check(pc.getComps().isIn("NVIDIA MX450"));
        }

        private static void equalsTest() {
            Set<String> comps1 = new Set<>();
            comps1.insert("AMD Ryzen 5");
            comps1.insert("8GB DDR4");
            comps1.insert("512GB SSD");
            comps1.insert("NVIDIA MX450");
            PC pc1 = new PC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps1
            );

            Set<String> comps2 = new Set<>();
            comps2.insert("NVIDIA MX450");
            comps2.insert("512GB SSD");
            comps2.insert("AMD Ryzen 5");
            comps2.insert("8GB DDR4");
            PC pc2 = new PC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps2
            );

            check(pc1.equals(pc2));
        }

        private static void toStringTest() {
            Set<String> comps1 = new Set<>();
            comps1.insert("AMD Ryzen 5");
            comps1.insert("8GB DDR4");
            comps1.insert("512GB SSD");
            comps1.insert("NVIDIA MX450");
            PC pc1 = new PC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps1
            );

            Set<String> comps2 = new Set<>();
            PC pc2 = new PC(
                    "Macbook Air",
                    2018,
                    "Apple",
                    comps2
            );

            check(pc1.toString().equals("PC<Thinkpad X1 Carbon,2022,Lenovo,Set{AMD Ryzen 5,8GB DDR4,512GB SSD,NVIDIA MX450}>"));
            check(pc2.toString().equals("PC<Macbook Air,2018,Apple,Set{}>"));
        }
    }

    private static class PCFactoryTest {
        private static void run() {
            instanceTest();
            createPCInstanceTest();
        }

        private static void instanceTest() {
            check(PCFactory.getInstance() == PCFactory.getInstance());
        }

        private static void createPCInstanceTest() {
            Set<String> comps = new Set<>();
            comps.insert("AMD Ryzen 5");
            comps.insert("8GB DDR4");
            comps.insert("512GB SSD");
            comps.insert("NVIDIA MX450");
            PC pc = PCFactory.getInstance().createPC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps
            );

            check(pc.getModel().equals("Thinkpad X1 Carbon"));
            check(pc.getYear() == 2022);
            check(pc.getManufacturer().equals("Lenovo"));
            check(pc.getComps().size() == comps.size());
            check(pc.getComps().isIn("AMD Ryzen 5"));
            check(pc.getComps().isIn("8GB DDR4"));
            check(pc.getComps().isIn("512GB SSD"));
            check(pc.getComps().isIn("NVIDIA MX450"));
        }
    }

    private static class PCReportTest {
        private static void run() {
            displayReportTest();
        }

        private static void displayReportTest() {
            Set<String> comps1 = new Set<>();
            comps1.insert("AMD Ryzen 5");
            comps1.insert("8GB DDR4");
            comps1.insert("512GB SSD");
            comps1.insert("NVIDIA MX450");
            PC pc1 = new PC(
                    "Thinkpad X1 Carbon",
                    2022,
                    "Lenovo",
                    comps1
            );

            Set<String> comps2 = new Set<>();
            comps2.insert("NVIDIA");
            comps2.insert("16GB DDR4");
            comps2.insert("256GB HDD");
            PC pc2 = new PC(
                    "MSI Gaming 7",
                    2023,
                    "MSI",
                    comps2
            );

            Set<String> comps3 = new Set<>();
            PC pc3 = new PC(
                    "Macbook Air",
                    2018,
                    "Apple",
                    comps3
            );

            String rp = new PCReport().displayReport(new PC[]{pc1, pc2, pc3});
            Scanner rpScanner = new Scanner(rp);
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));
            check(rpScanner.nextLine().equals("                                           PCPROG REPORT                                           "));
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));
            check(rpScanner.nextLine().equals("  1   Thinkpad X1 Carbon   2022          Lenovo [AMD Ryzen 5, 8GB DDR4, 512GB SSD, NVIDIA MX450]"));
            check(rpScanner.nextLine().equals("  2         MSI Gaming 7   2023             MSI [NVIDIA, 16GB DDR4, 256GB HDD]"));
            check(rpScanner.nextLine().equals("  3          Macbook Air   2018           Apple []"));
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));
        }
    }

    private static class PCProgTest {
        private static void run() throws FileNotFoundException {
            saveToFileTest();
        }

        private static void saveToFileTest() throws FileNotFoundException {
            StringBuilder input = new StringBuilder();

            input.append("Thinkpad X1 Carbon").append('\n');
            input.append(2022).append('\n');
            input.append("Lenovo").append('\n');
            input.append("AMD Ryzen 5").append('\n');
            input.append("8GB DDR4").append('\n');
            input.append("512GB SSD").append('\n');
            input.append("NVIDIA MX450").append('\n');
            input.append("").append('\n');
            input.append("Y").append('\n');

            input.append("MSI Gaming 7").append('\n');
            input.append(2023).append('\n');
            input.append("MSI").append('\n');
            input.append("NVIDIA").append('\n');
            input.append("16GB DDR4").append('\n');
            input.append("256GB HDD").append('\n');
            input.append("").append('\n');
            input.append("Y").append('\n');

            input.append("Macbook Air").append('\n');
            input.append(2018).append('\n');
            input.append("Apple").append('\n');
            input.append("").append('\n');
            input.append("N").append('\n');

            input.append("Y").append('\n');

            InputStream originalIn = System.in;
            PrintStream originalOut = System.out;
            System.setIn(new ByteArrayInputStream(input.toString().getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(new ByteArrayOutputStream()));

            PCProg.main(new String[0]);

            Scanner rpScanner = new Scanner(new File("pcs.txt"));
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));
            check(rpScanner.nextLine().equals("                                           PCPROG REPORT                                           "));
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));
            check(rpScanner.nextLine().equals("  1   Thinkpad X1 Carbon   2022          Lenovo [AMD Ryzen 5, 8GB DDR4, 512GB SSD, NVIDIA MX450]"));
            check(rpScanner.nextLine().equals("  2         MSI Gaming 7   2023             MSI [NVIDIA, 16GB DDR4, 256GB HDD]"));
            check(rpScanner.nextLine().equals("  3          Macbook Air   2018           Apple []"));
            check(rpScanner.nextLine().equals("---------------------------------------------------------------------------------------------------"));

            System.setIn(originalIn);
            System.setOut(originalOut);
        }
    }
}
