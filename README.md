# Sales API

REST API untuk manajemen data penjualan (produk, kategori, pelanggan) dibangun dengan **Express.js** dan **Supabase**, di-deploy ke **Vercel**.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## ⚙️ Environment Variables

Buat file `.env` di root project dengan isi berikut:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```

---

## 🚀 Menjalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan development server (dengan auto-reload)
npm run dev

# Atau production mode
npm start
```

Server berjalan di: `http://localhost:3000`

---

## 📦 Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3000` |
| Production (Vercel) | `https://<project-name>.vercel.app` |

---

## 📡 API Endpoints

### 🏷️ Categories

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/categories` | Ambil semua kategori |
| `GET` | `/api/categories/:id` | Ambil kategori berdasarkan ID |
| `POST` | `/api/categories` | Tambah kategori baru |
| `PUT` | `/api/categories/:id` | Update kategori |
| `DELETE` | `/api/categories/:id` | Hapus kategori |

---

### 📦 Products

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/products` | Ambil semua produk (mendukung filter) |
| `GET` | `/api/products/:id` | Ambil produk berdasarkan ID |
| `POST` | `/api/products` | Tambah produk baru |
| `PUT` | `/api/products/:id` | Update produk |
| `DELETE` | `/api/products/:id` | Hapus produk |

#### 🔍 Filter Query Parameters (`GET /api/products`)

| Parameter | Tipe | Deskripsi | Contoh |
|-----------|------|-----------|--------|
| `category_id` | integer | Filter berdasarkan ID kategori | `?category_id=1` |
| `name` | string | Filter nama produk (partial, case-insensitive) | `?name=laptop` |
| `min_price` | number | Harga minimum | `?min_price=100000` |
| `max_price` | number | Harga maksimum | `?max_price=500000` |
| `in_stock` | boolean | Hanya tampilkan produk yang ada stok (`true`) | `?in_stock=true` |

Filter dapat **dikombinasikan**:
```
GET /api/products?category_id=2&min_price=50000&in_stock=true
```

**Contoh Response `GET /api/products?category_id=1&in_stock=true`:**
```json
{
  "filters_applied": {
    "category_id": 1,
    "in_stock": true
  },
  "total": 3,
  "data": [
    {
      "id": 1,
      "sku": "PRD-001",
      "name": "Laptop Gaming",
      "description": "Laptop gaming high performance",
      "price": 15000000,
      "stock": 10,
      "category_id": 1
    }
  ]
}
```

---

### 👥 Customers

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/customers` | Ambil semua pelanggan |
| `GET` | `/api/customers/:id` | Ambil pelanggan berdasarkan ID |
| `POST` | `/api/customers` | Tambah pelanggan baru |
| `PUT` | `/api/customers/:id` | Update pelanggan |
| `DELETE` | `/api/customers/:id` | Hapus pelanggan |

---

## 🧪 Panduan Pengujian di Postman

### Setup Environment Postman

1. Buka Postman → klik **Environments** → **Import**
2. Import file `PPB_API_Postman_Environment.json`
3. Set variabel `base_url`:
   - **Local:** `http://localhost:3000`
   - **Production:** `https://<project>.vercel.app`

### Import Collection

1. Klik **Collections** → **Import**
2. Import file `PPB_API_Postman_Collection.json`

---

### ✅ Skenario Pengujian Produk

#### 1. GET Semua Produk (Tanpa Filter)

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "filters_applied": {},
  "total": 10,
  "data": [ ... ]
}
```

---

#### 2. Filter Berdasarkan Kategori

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?category_id=1`
- **Expected Status:** `200 OK`
- **Expected:** Hanya produk dengan `category_id = 1`
- **Verifikasi:** Semua item di `data` memiliki `"category_id": 1`

---

#### 3. Filter Berdasarkan Nama (Partial Search)

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?name=laptop`
- **Expected Status:** `200 OK`
- **Expected:** Produk yang namanya mengandung kata "laptop" (tidak case-sensitive)
- **Verifikasi:** Field `name` setiap item mengandung "laptop" / "Laptop" / "LAPTOP"

---

#### 4. Filter Berdasarkan Rentang Harga

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?min_price=100000&max_price=500000`
- **Expected Status:** `200 OK`
- **Expected:** Produk dengan harga antara 100.000 – 500.000
- **Verifikasi:** `price >= 100000` dan `price <= 500000` pada semua item

---

#### 5. Filter Hanya Produk Stok Tersedia

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?in_stock=true`
- **Expected Status:** `200 OK`
- **Expected:** Produk dengan `stock > 0`
- **Verifikasi:** `stock > 0` pada semua item

---

#### 6. Kombinasi Filter (Multi-filter)

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?category_id=1&min_price=50000&in_stock=true`
- **Expected Status:** `200 OK`
- **Expected:** Produk kategori 1, harga minimal 50.000, dan stok > 0

---

#### 7. Filter Invalid - category_id Bukan Angka

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?category_id=abc`
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "category_id must be a valid integer"
}
```

---

#### 8. Filter Invalid - min_price > max_price

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?min_price=999999&max_price=1000`
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "min_price cannot be greater than max_price"
}
```

---

#### 9. Filter Invalid - min_price Bukan Angka

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products?min_price=murah`
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "min_price must be a valid number"
}
```

---

#### 10. GET Produk Berdasarkan ID

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products/1`
- **Expected Status:** `200 OK`
- **Expected:** Data produk beserta informasi kategori (`categories`)

---

#### 11. GET Produk ID Tidak Ditemukan

- **Method:** `GET`
- **URL:** `{{base_url}}/api/products/999999`
- **Expected Status:** `404 Not Found`
- **Expected Response:**
```json
{
  "error": "..."
}
```

---

#### 12. POST Tambah Produk Baru

- **Method:** `POST`
- **URL:** `{{base_url}}/api/products`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "sku": "PRD-NEW-001",
  "name": "Produk Test Filter",
  "description": "Produk untuk pengujian fitur filter",
  "price": 250000,
  "stock": 15,
  "category_id": 1
}
```
- **Expected Status:** `201 Created`

---

#### 13. PUT Update Produk

- **Method:** `PUT`
- **URL:** `{{base_url}}/api/products/1`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "price": 300000,
  "stock": 20
}
```
- **Expected Status:** `200 OK`

---

#### 14. DELETE Hapus Produk

- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/products/1`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### ✅ Skenario Pengujian Kategori

#### 15. GET Semua Kategori

- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories`
- **Expected Status:** `200 OK`

---

#### 16. POST Tambah Kategori

- **Method:** `POST`
- **URL:** `{{base_url}}/api/categories`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Elektronik"
}
```
- **Expected Status:** `201 Created`

---

#### 17. GET Kategori by ID

- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories/1`
- **Expected Status:** `200 OK`

---

#### 18. PUT Update Kategori

- **Method:** `PUT`
- **URL:** `{{base_url}}/api/categories/1`
- **Body:**
```json
{
  "name": "Elektronik Updated"
}
```
- **Expected Status:** `200 OK`

---

#### 19. DELETE Hapus Kategori

- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/categories/1`
- **Expected Status:** `200 OK`

---

### ✅ Skenario Pengujian Pelanggan

#### 20. GET Semua Pelanggan

- **Method:** `GET`
- **URL:** `{{base_url}}/api/customers`
- **Expected Status:** `200 OK`

---

#### 21. POST Tambah Pelanggan

- **Method:** `POST`
- **URL:** `{{base_url}}/api/customers`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890"
}
```
- **Expected Status:** `201 Created`

---

## 🌐 Deploy ke Vercel

### Cara Deploy Pertama Kali

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

### Auto Deploy via GitHub

1. Push kode ke GitHub
2. Hubungkan repository di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables di Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Setiap `git push` ke branch `main` → otomatis deploy!

### Konfigurasi Vercel (`vercel.json`)

```json
{
  "version": 2,
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }]
}
```

---

## 📂 Struktur Proyek

```
Sales-API/
├── src/
│   ├── config/
│   │   └── supabaseClient.js    # Koneksi Supabase
│   ├── controllers/
│   │   ├── productController.js  # Logic produk + filter
│   │   ├── categoryController.js
│   │   └── customerController.js
│   ├── models/
│   │   ├── productModel.js       # Query Supabase dengan filter
│   │   ├── categoryModel.js
│   │   └── customerModel.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── customerRoutes.js
│   └── index.js                  # Entry point
├── .env                          # Environment variables (tidak di-commit)
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 👥 Tim Pengembang

**PPB - Kelompok 23**

---

*Dibuat dengan ❤️ menggunakan Express.js + Supabase*
