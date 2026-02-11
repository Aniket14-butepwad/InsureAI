import java.util.Scanner;

public class premiumcalculator {

    // LIFE INSURANCE PREMIUM
    public static double calculateLifePremium(int age, boolean smoker, double sumAssured) {
        double basePremium = 500;
        double ageFactor;
        double smokerFactor;
        double sumAssuredFactor;

        // Age factor
        if (age < 30) {
            ageFactor = 1.1;
        } else if (age <= 45) {
            ageFactor = 1.2;
        } else {
            ageFactor = 1.3;
        }

        // Smoker factor
        if (smoker) {
            smokerFactor = 1.4;
        } else {
            smokerFactor = 1.0;
        }

        // Sum assured factor
        if (sumAssured > 1000000) {
            sumAssuredFactor = 1.2;
        } else {
            sumAssuredFactor = 1.0;
        }

        return basePremium * ageFactor * smokerFactor * sumAssuredFactor;
    }

    // HEALTH INSURANCE PREMIUM
    public static double calculateHealthPremium(int age, boolean hasDisease, double coverageAmount) {
        double basePremium = 700;
        double ageFactor;
        double diseaseFactor;
        double coverageFactor;

        // Age factor
        if (age < 30) {
            ageFactor = 1.1;
        } else if (age <= 45) {
            ageFactor = 1.2;
        } else {
            ageFactor = 1.4;
        }

        // Disease factor
        if (hasDisease) {
            diseaseFactor = 1.5;
        } else {
            diseaseFactor = 1.0;
        }

        // Coverage factor
        if (coverageAmount > 500000) {
            coverageFactor = 1.3;
        } else {
            coverageFactor = 1.0;
        }

        return basePremium * ageFactor * diseaseFactor * coverageFactor;
    }

    // MOTOR INSURANCE PREMIUM
    public static double calculateMotorPremium(int vehicleAge, boolean commercialUse, double vehicleValue) {
        double basePremium = 300;
        double vehicleAgeFactor;
        double usageFactor;
        double valueFactor;

        // Vehicle age factor
        if (vehicleAge > 5) {
            vehicleAgeFactor = 1.3;
        } else {
            vehicleAgeFactor = 1.1;
        }

        // Usage factor
        if (commercialUse) {
            usageFactor = 1.5;
        } else {
            usageFactor = 1.0;
        }

        // Vehicle value factor
        if (vehicleValue > 500000) {
            valueFactor = 1.4;
        } else {
            valueFactor = 1.0;
        }

        return basePremium * vehicleAgeFactor * usageFactor * valueFactor;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Select Insurance Type:");
        System.out.println("1. Life Insurance");
        System.out.println("2. Health Insurance");
        System.out.println("3. Motor Insurance");

        int choice = sc.nextInt();
        double premium = 0;

        if (choice == 1) {
            System.out.print("Enter age: ");
            int age = sc.nextInt();

            System.out.print("Smoker? (true/false): ");
            boolean smoker = sc.nextBoolean();

            System.out.print("Enter sum assured: ");
            double sumAssured = sc.nextDouble();

            premium = calculateLifePremium(age, smoker, sumAssured);

        } else if (choice == 2) {
            System.out.print("Enter age: ");
            int age = sc.nextInt();

            System.out.print("Any pre-existing disease? (true/false): ");
            boolean disease = sc.nextBoolean();

            System.out.print("Enter coverage amount: ");
            double coverage = sc.nextDouble();

            premium = calculateHealthPremium(age, disease, coverage);

        } else if (choice == 3) {
            System.out.print("Enter vehicle age (years): ");
            int vehicleAge = sc.nextInt();

            System.out.print("Commercial use? (true/false): ");
            boolean commercial = sc.nextBoolean();

            System.out.print("Enter vehicle value: ");
            double value = sc.nextDouble();

            premium = calculateMotorPremium(vehicleAge, commercial, value);

        } else {
            System.out.println("Invalid choice");
            sc.close();
            return;
        }

        System.out.println("Calculated Monthly Premium = ₹" + premium);
        sc.close();
    }
}
