# Wallet Denomination Management System

The goal of this project is to design and implement a Wallet Denomination Management System (WDMS). This system will manage the storage, addition, and subtraction of various denominations of a single currency in a user's digital wallet. The primary objective is to ensure accurate and efficient handling of transactions while maintaining the integrity and security of the wallet. The system should be designed in a way that it can be extended to support multiple currencies if needed.

## Tech Stack

- Laravel 10
- Inertia.js
- React.js
- Tailwind CSS
- MySQL

## Requirements

- PHP 8.1 or higher
- Laravel 10
- Composer
- MySQL
- Node.js

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/zubayer-hossain/wallet-denomination-management.git
   ```
   ```bash
   cd wallet-denomination-management
    ```


2. **Install Dependencies**

   ```bash
   composer install
   npm install
   ```


3. **Environment Configuration**

   Copy the example environment file and make the necessary configuration changes in the `.env` file.

   ```bash
   cp .env.example .env
   ```
   Update these settings in the `.env` file to match your local environment:
- `DB_USERNAME` (your database username)
- `DB_PASSWORD` (your database password)

4. **Generate App Key**

   ```bash
   php artisan key:generate
   ```

5. **Create the Database and Run Migrations and Seeders**

   Create a new database in your database management system named `wallet-denomination-management`, and ensure that the database connection settings in `.env` are correct.
   ```bash
    php artisan migrate --seed
    ```
   It will create the necessary tables and seed the database with a test user with email `test@example.com` and 3 currencies (USD, BDT, MYR).


6. **Build Frontend Assets**

   ```bash
    npm run build
    ```


7. **Running the Application**
   Start the local development server:

   ```bash
    php artisan serve
    ```
   You can now access the server at http://localhost:8000.

## Running the Application

Navigate to http://localhost:8000 in your web browser to view the application. If everything is set up correctly, you should see your Laravel application running.

## Access the Application

To access the application you can register as a new user or use a user email from the database. The default user password is `password`.
