import java.util.*;
import java.io.*;

class Employee {

    int id;
    String name;
    String password;
    String type;

    Employee(int id, String name, String password, String type) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.type = type;
    }
}

public class AdminModule {

    ArrayList<Employee> employees = new ArrayList<>();
    String adminPassword = "1234";

    Scanner sc = new Scanner(System.in);

    //  ha recall el emp before starting
    public AdminModule() {
        loadEmployeesFromFile();
    }

    public void menu() {

        while (true) {

            System.out.println("\n ADMIN PANEL");
            System.out.println("1. Add Employee");
            System.out.println("2. List Employees");
            System.out.println("3. Delete Employee");
            System.out.println("4. Change Password");
            System.out.println("5. Back");

            System.out.print("--> Choice: ");
            int choice = sc.nextInt();

            if (choice == 1)
                addEmployee();
            else if (choice == 2)
                listEmployees();
            else if (choice == 3)
                deleteEmployee();
            else if (choice == 4)
                changePassword();
            else
                break;
        }
    }

    public void addEmployee() {

        System.out.println("\n+ ADD EMPLOYEE");

        System.out.print("ID: ");
        int id = sc.nextInt();

        System.out.print("Name: ");
        String name = sc.next();

        System.out.print("Password: ");
        String pass = sc.next();

        System.out.print("Type: ");
        String type = sc.next();

        employees.add(new Employee(id, name, pass, type));

        saveEmployeesToFile(); //  SAVE

        System.out.println("✔ Employee added");
    }

    public void listEmployees() {

        System.out.println("\n EMPLOYEES:");

        if (employees.isEmpty()) {
            System.out.println("No employees.");
            return;
        }

        for (Employee e : employees)
            System.out.println(e.id + " | " + e.name + " | " + e.type);
    }

    public void deleteEmployee() {

        System.out.print("Enter ID to delete: ");
        int id = sc.nextInt();

        employees.removeIf(e -> e.id == id);

        saveEmployeesToFile(); //  UPDATE FILE

        System.out.println("✔ Done");
    }

    public void changePassword() {

        System.out.print("Old password: ");
        String old = sc.next();

        if (old.equals(adminPassword)) {
            System.out.print("New password: ");
            adminPassword = sc.next();
            System.out.println("✔ Updated");
        } else {
            System.out.println("❌ Wrong password");
        }
    }

    //  SAVE EMPLOYEES TO FILE
    public void saveEmployeesToFile() {

        try {

            PrintWriter writer = new PrintWriter("employees.txt");

            for (Employee e : employees) {

                writer.println(e.id + "," + e.name + "," + e.password + "," + e.type);
            }

            writer.close();

        } catch (Exception e) {

            System.out.println("❌ Error saving employees file");
        }
    }

    // hn LOAD EMPLOYEES FROM FILE
    public void loadEmployeesFromFile() {

        try {

            File file = new File("employees.txt");

            if (!file.exists())
                return;

            Scanner fileReader = new Scanner(file);

            while (fileReader.hasNextLine()) {

                String line = fileReader.nextLine();

                String[] data = line.split(",");

                int id = Integer.parseInt(data[0]);
                String name = data[1];
                String pass = data[2];
                String type = data[3];

                employees.add(new Employee(id, name, pass, type));
            }

            fileReader.close();

        } catch (Exception e) {

            System.out.println("❌ Error loading employees file");
        }
    }
}