# Book Bay

A comprehensive book management application built with Express.js, MongoDB, and Docker, featuring user authentication, book management, shopping cart functionality, and payment processing. This project allows admins to manage books and users, while regular users can browse and purchase books.

## Features

-   User authentication (signup, login, logout)
-   Admin dashboard for managing books and users
-   Book browsing with search, filter, and sort functionality
-   Shopping cart functionality for users
-   Payment processing with Stripe
-   Review system for books
-   Category management for books

## Technologies Used

-   **ExpressJs**: Web framework for NodeJs
-   **MongoDB**: NoSQL database for data storage
-   **Docker**: Containerization for easy deployment
-   **Stripe**: Payment processing
-   **Zod**: Validation library for request data
-   **Multer**: File upload library
-   **Cloudinary**: Image upload service
-   **JWT**: JSON Web Token for user authentication
-   **Bcrypt**: Password hashing for security

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/alok-x0s1/Book-Bay.git
    cd Book-Bay
    ```

2. **Copy the `.env.example` file to `.env`**:

    ```bash
    cp .env.example .env
    ```

3. **Upadte the `.env` file**:

-   Set the following for the **MongoDB connection**:

    ```env
    DATABASE_URL=mongodb://mongo:27017/book-bay
    ```

    -   Set other environment variables like **JWT_SECRET**, **CORS_ORIGIN**, etc., to your desired values.

4. **Start MongoDB and the application using Docker Compose**:

    ```bash
    docker-compose up --build
    ```

5. **Access the application**:

    Open your browser and go to `http://localhost:3000` to access your application.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

1. [Fork the repository](https://github.com/alok-x0s1/Book-Bay)

2. Clone the forked repository:

    ```bash
    git clone https://github.com/<your-username>/Book-Bay.git
    ```

3. Create a new branch for your changes:

    ```bash
    git checkout -b feature/foo-bar
    ```

4. Make your changes and commit them:

    ```bash
    git add .
    git commit -m "Add some foo bar"
    ```

5. Push your changes to your forked repository:

    ```bash
    git push origin feature/foo-bar
    ```

6. Create a pull request:

    Open a pull request on the original repository, linking it to your forked repository.

## Contact

If you have any questions or feedback, please reach out to [GitHub](https://github.com/alok-x0s1)

❤️ Thank you for using Book Bay!
