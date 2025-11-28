# Panduan Deployment: Portfolio Website (InfinityFree + Vercel)

Dokumentasi lengkap cara upload backend ke InfinityFree dan frontend ke Vercel.

## 1. Persiapan Database & Backend (InfinityFree)

InfinityFree adalah hosting PHP gratis yang menggunakan VistaPanel (cPanel versi gratis).

### Langkah 1: Buat Akun & Database
1.  Daftar di [InfinityFree](https://infinityfree.net/).
2.  Buat akun hosting baru. Pilih **Subdomain** dan masukkan nama yang Anda inginkan (misalnya `iname` pada `page.gd` sehingga menjadi `iname.page.gd`).
3.  Setelah aktif, masuk ke **Control Panel** (VistaPanel).
4.  Cari menu **MySQL Databases**.
5.  Di bagian "Create New Database", masukkan nama database (misal: `portofolio`) lalu klik **Create Database**.
6.  Catat informasi yang muncul di bagian "Current Databases":
    *   **MySQL DB Name** (biasanya ada prefix, misal `if0_37373_portofolio`)
    *   **MySQL User Name** (misal `if0_37373`)
    *   **MySQL Password** (Password akun VPanel Anda, cek di client area jika lupa)
    *   **MySQL Host Name** (misal `sql123.infinityfree.com`)

### Langkah 2: Import SQL
1.  Di VistaPanel, buka **phpMyAdmin**.
2.  Klik tombol "Connect Now" atau pilih database yang baru dibuat di sidebar kiri.
3.  Klik tab **Import**.
4.  Upload file `backend/database.sql` dari project ini.
5.  Klik **Go** untuk membuat tabel.

### Langkah 3: Konfigurasi Koneksi Database
1.  Buka file `backend/config/db.php` di komputer Anda (atau edit nanti di File Manager).
2.  Anda perlu menyesuaikan kredensial. Namun, cara terbaik adalah membuat file `.env` nanti di server, atau edit langsung kodenya jika `.env` tidak terbaca.
3.  Karena InfinityFree kadang memblokir pembacaan `.env` di luar root, kita akan edit file `db.php` langsung atau pastikan variabel sesuai.
    *   *Saran:* Edit `backend/config/db.php` dan masukkan kredensial InfinityFree Anda secara hardcode (jika `.env` sulit) atau pastikan upload file `.env`.

### Langkah 4: Upload File Backend
1.  Buka **Online File Manager** dari Control Panel InfinityFree.
2.  Masuk ke folder `htdocs`. **Hapus semua file default** (seperti `index2.html` atau `default.php`).
3.  Upload **semua isi folder `backend`** ke dalam folder `htdocs`.
    *   Struktur di `htdocs` harusnya seperti ini:
        *   `config/`
        *   `routes/`
        *   `uploads/` (Buat folder ini jika belum ada, set permission ke 777 jika perlu)
        *   `index.php`
        *   `.htaccess` (Sangat PENTING! Pastikan file ini terupload)
        *   `database.sql` (Opsional)
4.  **Edit `config/db.php`** (Klik kanan -> Edit):
    *   Ubah bagian `getenv(...)` dengan data asli jika `.env` tidak bekerja.
    ```php
    $this->host = 'sql123.infinityfree.com'; // Ganti sesuai MySQL Host Name
    $this->db_name = 'if0_345678_portofolio'; // Ganti sesuai MySQL DB Name
    $this->username = 'if0_345678'; // Ganti sesuai MySQL User Name
    $this->password = 'password_vpanel_anda';
    ```
    *   *Simpan.*

### Langkah 5: Cek Backend
Buka browser dan akses `https://iname.page.gd/projects`.
*   Jika muncul JSON kosong `[]` atau data, berarti sukses.
*   Jika error 500, cek konfigurasi database di `db.php`.

---

## 2. Deployment Frontend (Vercel)

Vercel sangat direkomendasikan untuk React.

### Langkah 1: Push ke GitHub
1.  Pastikan kode project ini sudah ada di repository GitHub Anda.

### Langkah 2: Buat Project di Vercel
1.  Login ke [Vercel](https://vercel.com).
2.  Klik **Add New...** -> **Project**.
3.  Import repository GitHub Anda.
4.  Pada bagian **Build and Output Settings**, biarkan default (Vite biasanya terdeteksi otomatis).
    *   Framework Preset: Vite
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  **PENTING: Environment Variables**
    *   Klik menu dropdown **Environment Variables**.
    *   Masukkan:
        *   Key: `VITE_API_URL`
        *   Value: `https://iname.page.gd` (Tanpa garis miring di akhir)
    *   Klik **Add**.
6.  Klik **Deploy**.

### Langkah 3: Selesai
Setelah deploy sukses, Vercel akan memberikan domain (misal `portfolio-anda.vercel.app`).
Buka website tersebut. Coba login admin dan upload gambar.

*   **Login Admin Default:**
    *   Username: `admin`
    *   Password: `password123`

---

## Catatan Penting InfinityFree

1.  **CORS**: Script backend sudah diset `Access-Control-Allow-Origin: *`. Ini harusnya aman untuk InfinityFree. Jika bermasalah, ubah `*` menjadi domain Vercel Anda di `backend/index.php`.
2.  **Upload Gambar**: InfinityFree memiliki batasan inode dan keamanan file. Folder `uploads/` akan menyimpan gambar. Jika gambar tidak muncul, cek permission folder `uploads` di File Manager (klik kanan -> Permissions -> set 755 atau 777).
3.  **HTTP vs HTTPS**: InfinityFree menyediakan SSL gratis. Pastikan Anda mengaktifkan SSL di client area InfinityFree agar backend bisa diakses via `https://`. Jika tidak, browser akan memblokir request dari Vercel (HTTPS) ke backend (HTTP). **Wajib aktifkan SSL di InfinityFree.**
