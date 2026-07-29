# 🛒 E-Commerce Website

A full-stack E-Commerce web application built using **Spring Boot** for the backend and **React (Vite)** for the frontend. The application provides a complete online shopping experience with secure authentication, product management, shopping cart, and Stripe payment integration.

---

## 🚀 Features

### User
- User Registration & Login
- JWT Authentication
- Browse Products
- Search & Filter Products
- Add to Cart
- Update Cart Quantity
- Place Orders
- Secure Stripe Payment
- Order History

### Admin
- Admin Login
- Add Products
- Update Products
- Delete Products
- Manage Categories
- Manage Orders

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Bootstrap / CSS

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- REST APIs

### Database
- MySQL

### Payment Gateway
- Stripe

---

## 📂 Project Structure

```
Ecommerce-website/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Ajay00325/Ecommerce-website.git
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create an `application.properties` file in the backend and configure:

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

stripe.secret.key=YOUR_STRIPE_SECRET_KEY
jwt.secret=YOUR_JWT_SECRET
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Login Page
- Product Page
- Shopping Cart
- Checkout
- Admin Dashboard

---

## 📌 Future Enhancements

- Wishlist
- Product Reviews
- Email Notifications
- Order Tracking
- Coupon & Discount System
- AI Product Recommendations

---

## 👨‍💻 Author

**Ajay Maddila**

GitHub: https://github.com/Ajay00325
