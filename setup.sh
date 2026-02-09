#!/bin/bash

echo "Task Manager Backend - Setup Script"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Check if MySQL is running (optional)
# echo ""
# echo "Checking MySQL..."
# mysql -u root -e "SELECT 1" &> /dev/null
# if [ $? -eq 0 ]; then
#     echo "✓ MySQL is running"
#     read -p "Do you want to create the database? (y/n) " -n 1 -r
#     echo
#     if [[ $REPLY =~ ^[Yy]$ ]]; then
#         mysql -u root -e "CREATE DATABASE IF NOT EXISTS task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
#         echo "✓ Database created successfully"
#     fi
# else
#     echo "ℹ MySQL is not running. Please start MySQL and run the following command:"
#     echo "  mysql -u root -e \"CREATE DATABASE task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
# fi

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create the database: mysql -u root -e \"CREATE DATABASE task_manager;\""
echo "3. Run: npm run dev"
echo ""
