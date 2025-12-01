Here’s a clean and **short & sweet** `README.md` you can use in your project 👇

---

# 🛒 Hotel Bazaar — Supabase Migration

This project migrates the **existing MongoDB database** to **Supabase (PostgreSQL + Storage)** while keeping all data intact — including users, products, orders, and product images.

---

## 📌 Overview

* Old DB: **MongoDB**
* New DB: **Supabase (PostgreSQL)**
* Images moved to **Supabase Storage Bucket**
* JSON arrays from MongoDB handled using **JSONB + relation tables**

---

## 🧠 Database Schema (Supabase)

### **1️⃣ users**

```sql
id UUID PRIMARY KEY
mongo_id TEXT UNIQUE
name, email, phone, address
password, google_id
role ('user' | 'admin')
email_verified BOOLEAN
verification_token, verification_expires
order_otp, order_otp_expires
created_at TIMESTAMP
```

### **2️⃣ products**

```sql
id UUID PRIMARY KEY
mongo_id TEXT UNIQUE
name, description, price, category, stock
image_url TEXT   -- Supabase Storage URL
created_at TIMESTAMP
```

### **3️⃣ product_orders** (many-to-many users ↔ products)

```sql
id UUID PRIMARY KEY
product_id → products.id (FK)
user_id → users.id (FK)
created_at TIMESTAMP
```

### **4️⃣ orders**

```sql
id UUID PRIMARY KEY
mongo_id TEXT UNIQUE
username TEXT
products JSONB         -- [{ name, price, quantity }]
order_date TIMESTAMP
```

---

## 📦 Storage (Product Images)

**Bucket Name:** `product-images`
Images are uploaded as files, and their **URL is stored in products.image_url**

```js
supabase.storage
  .from('product-images')
  .upload(`products/${id}.jpg`, imageFile);
```

---

## 🚀 Final Notes

* MongoDB `_id` is preserved as `mongo_id`
* Password allows `NULL` for Google-auth users
* Database fully ready for Supabase API + frontend integration

---

Let me know if you need:
✔ ER Diagram
✔ API routes in Express
✔ PDF report for submission

---

Happy Building! ⚡💻🚀
