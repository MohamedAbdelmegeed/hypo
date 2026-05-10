import java.util.*;

public class SalesModule {

    Scanner sc = new Scanner(System.in);

    public void menu(ArrayList<Product> products, UserModule user, MarketingModule marketing) {

        while (true) {

            System.out.println("\n SALES");
            System.out.println("1. Make Order");
            System.out.println("2. Back");
            System.out.print("--> Choice: ");
            int c = sc.nextInt();

            if (c == 1)
                makeOrder(products, user, marketing);
            else
                break;
        }
    }

    public void makeOrder(ArrayList<Product> products, UserModule user, MarketingModule marketing) {

        // 🛒 AVAILABLE PRODUCTS MENU
        System.out.println("\n====================================");
        System.out.println(" AVAILABLE PRODUCTS");
        System.out.println("====================================");

        for (Product p : products) {

            System.out.println("ID: " + p.id + " | " + p.name + " | Price: $" + p.price + " | Qty: " + p.quantity);
        }

        System.out.println("====================================");

        System.out.print("Product ID: ");
        int id = sc.nextInt();

        System.out.print("Quantity: ");
        int q = sc.nextInt();

        boolean found = false;

        for (Product p : products) {

            if (p.id == id) {
                found = true;

                if (p.quantity >= q) {

                    p.quantity -= q;

                    // ==========================
                    // ⭐ ADDED OFFER LOGIC
                    // ==========================

                    Offer offer = marketing.getOfferForProduct(p.name);

                    double original = p.price;
                    double finalPrice = original;
                    double discount = 0;

                    if (offer != null) {
                        discount = offer.discount;
                        finalPrice = original - (original * discount / 100);
                    }

                    double total = finalPrice * q;

                    System.out.println("\n🧾 ORDER SUMMARY");

                    System.out.println("Product: " + p.name);
                    System.out.println("Price before: $" + original);

                    if (offer != null) {
                        System.out.println("Discount: " + discount + "%");
                        System.out.println("Price after: $" + finalPrice);
                    } else {
                        System.out.println("No active offer");
                        System.out.println("Price after: $" + finalPrice);
                    }

                    System.out.println("Qty: " + q);
                    System.out.println("✔ Total = " + total);

                    user.addPurchase(p.name, q, total);

                    System.out.println(" Thank you for your purchase!");

                } else {
                    System.out.println("❌ Not enough stock");
                }
            }
        }

        if (!found) {
            System.out.println("❌ Product not found");
        }
    }
}