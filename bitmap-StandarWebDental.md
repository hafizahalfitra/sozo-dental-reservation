# 🧠 BOOKING SYSTEM BITMAP (SOZO DENTAL)

## 🎯 CORE OBJECTIVE
Mengubah sistem booking menjadi fitur utama aplikasi:
- User bisa membuat booking
- User bisa melihat booking aktif
- User bisa melihat riwayat booking
- Navbar hanya menjadi pintu masuk booking (single entry point)

---

# 🧭 NAVBAR ARCHITECTURE

## MENU PUBLIC (SEBELUM LOGIN)
- Beranda → /
- About Us → /about
- Fasilitas → /services
- Dokter → /doctors
- Kontak → /contact
- Booking → /login (redirect jika belum login)

---

## MENU AUTHENTICATED (SETELAH LOGIN)

Semua menu tetap sama + Booking berubah behavior:

- Beranda
- About Us
- Fasilitas
- Dokter
- Kontak
- Booking → /dashboard/booking

❌ TIDAK ADA MENU DASHBOARD TERPISAH

---

# 🔐 AUTH RULES

## Booking Guard
Jika user akses:
- /dashboard/booking

Jika NOT logged in:
→ redirect("/login")

---

# 📂 ROUTE STRUCTURE

## PUBLIC ROUTES
- /
- /about
- /services
- /doctors
- /contact
- /login

## PROTECTED ROUTES
- /dashboard/booking

---

# 🧩 DASHBOARD BOOKING PAGE

## ROUTE:
```

/dashboard/booking

```

## UI STRUCTURE:
TAB SYSTEM:

### 1. 📝 BUAT BOOKING
Form:
- doctorId (select)
- serviceId (select)
- date
- time
- notes (optional)

ACTION:
POST /api/booking
status default: "pending"

---

### 2. 📌 BOOKING AKTIF
FILTER:
- userId = session.user.id
- status IN ("pending", "confirmed")

DISPLAY:
- Doctor
- Service
- Date & Time
- Status

OPTION:
- Cancel booking

---

### 3. 📜 RIWAYAT BOOKING
FILTER:
- userId = session.user.id
- status IN ("completed", "cancelled")

DISPLAY:
- History list sorted DESC

---

# 🗄️ DATABASE MODEL (PRISMA STYLE)

```

Booking {
id
userId
doctorId
serviceId
date
time
notes
status: "pending" | "confirmed" | "completed" | "cancelled"
createdAt
}

```

---

# 🔌 API STRUCTURE

## CREATE BOOKING
POST /api/booking

## GET ACTIVE BOOKING
GET /api/booking/current

## GET HISTORY BOOKING
GET /api/booking/history

---

# 🧠 NAVBAR LOGIC RULE

## SINGLE ENTRY POINT RULE

Navbar hanya punya 1 logic booking:

IF user NOT logged in:
  Booking → /login

IF user logged in:
  Booking → /dashboard/booking

---

# ⚠️ RULES IMPORTANT

- ❌ Tidak boleh ada menu "Dashboard"
- ❌ Tidak boleh direct ke /dashboard/patient
- ❌ Tidak boleh split booking & dashboard
- ✔ Booking = pusat semua aktivitas user

---

# 🔄 DATA FLOW

1. User klik Booking
2. Redirect:
   - guest → login
   - auth → dashboard booking
3. User create booking
4. Booking masuk status "pending"
5. User lihat:
   - Active booking
   - History booking

---

# ✅ DONE CRITERIA

- Navbar stabil (tidak hilang menu)
- Booking bekerja sebagai sistem utama
- Tidak ada dashboard menu terpisah
- Form booking berjalan
- Active & history terpisah
- No hydration error
- No missing i18n keys
```

