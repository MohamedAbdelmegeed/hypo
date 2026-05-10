// ONLY ADDITIONS ARE MARKED WITH ⭐

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.*;

class Product {

    int id;
    String name;
    double price;
    int quantity;
    int minStock;
    LocalDate expiry;

    Product(int id, String name, double price, int quantity, int minStock, LocalDate expiry) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.minStock = minStock;
        this.expiry = expiry;
    }

    void display() {
        System.out.println(id + " | " + name + " | $" + price + " | Qty: " + quantity);
    }
}

public class InventoryModule {

    ArrayList<Product> products = new ArrayList<>();
    Scanner sc = new Scanner(System.in);

    public InventoryModule() {
        loadProductsFromFile();
    }

    public void menu() {

        while (true) {

            checkAlerts();

            System.out.println("\n INVENTORY");
            System.out.println("1. Add Product");
            System.out.println("2. List Products");
            System.out.println("3. Search Product");
            System.out.println("4. Delete Product");
            System.out.println("5. Damaged Product");
            System.out.println("6. Back");
            System.out.println("7. Restock Product ⭐"); // NEW

            System.out.print("--> Choice: ");
            int c = sc.nextInt();

            if (c == 1)
                addProduct();
            else if (c == 2)
                listProducts();
            else if (c == 3)
                searchProduct();
            else if (c == 4)
                deleteProduct();
            else if (c == 5)
                damagedProduct();
            else if (c == 7)
                restockProduct(); // NEW
            else
                break;
        }
    }

    // ⭐ UPDATED ADD PRODUCT (NO DUPLICATES)
    public void addProduct() {

        System.out.print("ID: ");
        int id = sc.nextInt();

        System.out.print("Name: ");
        String name = sc.next();

        // ❌ CHECK DUPLICATE
        for (Product p : products) {
            if (p.id == id || p.name.equalsIgnoreCase(name)) {
                System.out.println("❌ Product already exists! Use RESTOCK instead.");
                return;
            }
        }

        System.out.print("Price: ");
        double price = sc.nextDouble();

        System.out.print("Qty: ");
        int qty = sc.nextInt();

        System.out.print("Min Stock: ");
        int min = sc.nextInt();

        System.out.print("Expiry (yyyy/MM/dd): ");
        String date = sc.next();

        DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate expiry = LocalDate.parse(date, f);

        products.add(new Product(id, name, price, qty, min, expiry));

        saveProductsToFile();

        System.out.println("✔ Added");
    }

    // ⭐ NEW FEATURE: RESTOCK EXISTING PRODUCT
    public void restockProduct() {

        System.out.print("Enter Product ID: ");
        int id = sc.nextInt();

        System.out.print("Add Quantity: ");
        int addQty = sc.nextInt();

        boolean found = false;

        for (Product p : products) {

            if (p.id == id) {

                p.quantity += addQty;
                found = true;

                System.out.println("✔ Stock updated");
                System.out.println("New Quantity: " + p.quantity);

                saveProductsToFile();
                break;
            }
        }

        if (!found)
            System.out.println("❌ Product not found");
    }

    public void listProducts() {
        for (Product p : products)
            p.display();
    }

    public void searchProduct() {

        System.out.print("Enter ID: ");
        int id = sc.nextInt();

        for (Product p : products)
            if (p.id == id)
                p.display();
    }

    public void deleteProduct() {

        System.out.print("Enter Product ID to delete: ");
        int id = sc.nextInt();

        boolean found = false;

        for (Product p : products) {

            if (p.id == id) {
                products.remove(p);

                saveProductsToFile();

                found = true;
                System.out.println("✔ Product Deleted");
                break;
            }
        }

        if (!found)
            System.out.println("❌ Product not found");
    }

    public void damagedProduct() {

        System.out.print("Enter Product ID: ");
        int id = sc.nextInt();

        System.out.print("Damaged Quantity: ");
        int damagedQty = sc.nextInt();

        boolean found = false;

        for (Product p : products) {

            if (p.id == id) {

                found = true;

                if (p.quantity >= damagedQty) {

                    p.quantity -= damagedQty;

                    saveProductsToFile();

                    System.out.println("✔ Damaged items removed");
                    System.out.println("Remaining Qty: " + p.quantity);

                } else {
                    System.out.println("❌ Not enough quantity");
                }
            }
        }

        if (!found)
            System.out.println("❌ Product not found");
    }

    public void checkAlerts() {

        LocalDate today = LocalDate.now();

        for (Product p : products) {

            if (p.quantity <= p.minStock) {
                System.out.println("⚠ LOW STOCK: " + p.name + " | Qty = " + p.quantity);
            }

            if (p.expiry.isBefore(today)) {
                System.out.println("❌ EXPIRED PRODUCT: " + p.name);
            }

            else if (p.expiry.minusDays(3).isBefore(today)) {
                System.out.println("⚠ NEAR EXPIRY: " + p.name + " | Expiry: " + p.expiry);
            }
        }
    }

    public void saveProductsToFile() {

        try {

            PrintWriter writer = new PrintWriter("products.txt");

            for (Product p : products) {

                writer.println(
                        p.id + "," +
                                p.name + "," +
                                p.price + "," +
                                p.quantity + "," +
                                p.minStock + "," +
                                p.expiry
                );
            }

            writer.close();

        } catch (Exception e) {
            System.out.println("❌ Error saving products file");
        }
    }

    public void loadProductsFromFile() {

        try {

            File file = new File("products.txt");

            if (!file.exists())
                return;

            Scanner fileReader = new Scanner(file);

            while (fileReader.hasNextLine()) {

                String line = fileReader.nextLine();
                String[] data = line.split(",");

                int id = Integer.parseInt(data[0]);
                String name = data[1];
                double price = Double.parseDouble(data[2]);
                int quantity = Integer.parseInt(data[3]);
                int minStock = Integer.parseInt(data[4]);
                LocalDate expiry = LocalDate.parse(data[5]);

                products.add(new Product(id, name, price, quantity, minStock, expiry));
            }

            fileReader.close();

        } catch (Exception e) {
            System.out.println("❌ Error loading products file");
        }
    }

    public ArrayList<Product> getProducts() {
        return products;
    }
}