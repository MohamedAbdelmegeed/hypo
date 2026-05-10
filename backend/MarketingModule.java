import java.util.*;
import java.io.*;

class Offer {

    String productName;
    double originalPrice;
    double discount;
    double finalPrice;

    Offer(String productName, double originalPrice, double discount, int days) {

        this.productName = productName;
        this.originalPrice = originalPrice;
        this.discount = discount;

        this.finalPrice = originalPrice - (originalPrice * discount / 100);
    }

    public void show() {
        System.out.println(
                productName +
                        " | Before: $" + originalPrice +
                        " | After: $" + finalPrice +
                        " | " + discount + "% OFF");
    }
}

public class MarketingModule {

    ArrayList<Offer> offers = new ArrayList<>();
    Scanner sc = new Scanner(System.in);

    //  LOAD OFFERS ON START
    public MarketingModule() {
        loadOffersFromFile();
    }

    public void menu(ArrayList<Product> products) {

        while (true) {

            System.out.println("\n MARKETING MENU");
            System.out.println("1 Create Offer");
            System.out.println("2 Show Offers");
            System.out.println("3 Back");

            int c = sc.nextInt();

            if (c == 1)
                createOffer(products);
            else if (c == 2)
                showOffers();
            else
                break;
        }
    }

    public void createOffer(ArrayList<Product> products) {

        System.out.println("\n Products:");

        for (Product p : products)
            System.out.println(p.id + " | " + p.name + " | $" + p.price);

        System.out.print("Product ID: ");
        int id = sc.nextInt();

        Product selected = null;

        for (Product p : products)
            if (p.id == id)
                selected = p;

        if (selected == null) {
            System.out.println("❌ Not found");
            return;
        }

        System.out.print("Discount %: ");
        double discount = sc.nextDouble();

        System.out.print("Days: ");
        int days = sc.nextInt();

        offers.add(new Offer(
                selected.name,
                selected.price,
                discount,
                days));

        saveOffersToFile(); //  SAVE

        System.out.println("✔ Offer created");
    }

    public void showOffers() {
        for (Offer o : offers)
            o.show();
    }

    //  SAVE OFFERS TO FILE
    public void saveOffersToFile() {

        try {

            PrintWriter writer = new PrintWriter("offers.txt");

            for (Offer o : offers) {

                writer.println(
                        o.productName + "," +
                                o.originalPrice + "," +
                                o.discount + "," +
                                o.finalPrice
                );
            }

            writer.close();

            //  HUMAN READABLE REPORT
            PrintWriter report = new PrintWriter("offers_report.txt");

            report.println("====================================");
            report.println("        MARKETING OFFERS REPORT");
            report.println("====================================\n");

            for (Offer o : offers) {

                report.println("====================================");
                report.println("Product       : " + o.productName);
                report.println("Original Price: $" + o.originalPrice);
                report.println("Discount      : " + o.discount + "%");
                report.println("Final Price   : $" + o.finalPrice);
                report.println("====================================\n");
            }

            report.close();

        } catch (Exception e) {
            System.out.println("❌ Error saving offers file");
        }
    }

    // LOAD OFFERS FROM FILE
    public void loadOffersFromFile() {

        try {

            File file = new File("offers.txt");

            if (!file.exists())
                return;

            Scanner fileReader = new Scanner(file);

            while (fileReader.hasNextLine()) {

                String line = fileReader.nextLine();
                String[] data = line.split(",");

                String name = data[0];
                double original = Double.parseDouble(data[1]);
                double discount = Double.parseDouble(data[2]);
                double finalPrice = Double.parseDouble(data[3]);

                Offer o = new Offer(name, original, discount, 0);
                o.finalPrice = finalPrice;

                offers.add(o);
            }

            fileReader.close();

        } catch (Exception e) {
            System.out.println("❌ Error loading offers file");
        }
    }

    // ==============================
    // ADDED: LINK FUNCTION (NO CHANGES ABOVE)
    // ==============================

    public Offer getOfferForProduct(String productName) {

        for (Offer o : offers) {

            if (o.productName.equalsIgnoreCase(productName)) {
                return o;
            }
        }

        return null;
    }
}