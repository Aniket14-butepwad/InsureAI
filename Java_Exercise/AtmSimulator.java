import java.util.Scanner;

class InvalidInputException extends Exception{
    public InvalidInputException(String message){
        super(message);
    }
}
class InsufficientFundsException extends Exception{
    public InsufficientFundsException(String message){
        super(message);
    }
}

public class AtmSimulator{
     static double balance = 1000;

    public static void deposit(double amount)throws InvalidInputException, InsufficientFundsException {
     if(amount <= 0){
        throw new InvalidInputException("Deposit amount must be positive !");
     }
     balance += amount;
     System.out.println("Successfully deposited - "+amount);
}    
    public static void withdraw(double amount)throws InvalidInputException, InsufficientFundsException {
      if(amount <= 0){
        throw new InvalidInputException("Withdrawl amount mut be positive !");
     }
     if(amount > balance){
        throw new InsufficientFundsException("Insufficinet Funds !");
     }
     balance -= amount;
     System.out.println("Successfully withdrawn - "+amount);
}    

public static void main(String[]args){
     Scanner sc = new Scanner(System.in);
     
     while(true){
        System.out.println("\n -----ATM Simulator-----");
        System.out.println("1.Check balance");
        System.out.println("2.Deposit Money");
        System.out.println("3.Withdraw Money");
        System.out.println("4.Exit");
        System.out.println("Choose an option :-");

        try{
            int choice = sc.nextInt();

            switch(choice){
                case 1:
                System.out.println("Balance is :-"+balance);
                break;

                case 2:
                System.out.println("Enter the amount to deposit :-");
                double depositAmount = sc.nextDouble();
                deposit(depositAmount);
                break;

                case 3:
                 System.out.println("Enter the amount to Withdraw :-");
                double withdrawAmount = sc.nextDouble();
                withdraw(withdrawAmount);
                break;

                case 4:
                System.out.println("Thanks for using Atm!");
                sc.close();
                return;

                default:
                throw new InvalidInputException("Invalid menu choice !");
            }
        }
        catch(InvalidInputException | InsufficientFundsException e){
             System.out.println("Error :"+e.getMessage());
        }
        catch(Exception e){
             System.out.println("Unpexpectedd Error :"+e.getMessage());
             sc.nextLine();
        }
        finally{
                System.out.println("Transaction is complete .\n");
        }
    }  
    
   }
}