# Panduan Deployment InfinityFree (Frontend + Backend)

Panduan ini dikhususkan untuk mendeploy **Frontend React** dan **Backend PHP** dalam satu domain di hosting InfinityFree.

## Struktur Akhir di Hosting (htdocs)

Nantinya, isi folder `htdocs` di File Manager Anda akan terlihat seperti ini:

```
htdocs/
├── api/                  <-- Folder Backend
│   ├── config/
│   ├── routes/
│   ├── uploads/
│   ├── index.php
│   └── .htaccess
├── assets/               <-- Dari build React
├── index.html            <-- Dari build React
├── vite.svg              <-- Dari build React
└── .htaccess             <-- File konfigurasi routing utama
```

---

## Tahap 1: Persiapan Lokal (Build React)

Karena InfinityFree tidak bisa menjalankan Node.js, Anda harus mengubah kode React menjadi file statis (HTML/CSS/JS) di komputer Anda terlebih dahulu.

1.  Buka terminal di komputer Anda.
2.  Masuk ke folder `frontend`.
3.  Jalankan perintah build:
    ```bash
    npm install
    npm run build
    ```
4.  Setelah selesai, akan muncul folder baru bernama `dist` di dalam folder `frontend`.
5.  Isi folder `dist` inilah yang akan kita upload nanti.

---

## Tahap 2: Persiapan Database (InfinityFree)

1.  Login ke [InfinityFree](https://infinityfree.net/) -> **Client Area**.
2.  Masuk ke **Control Panel** (VistaPanel).
3.  Pilih menu **MySQL Databases**.
4.  Buat database baru (misal: `portofolio`).
5.  Catat data berikut dari halaman tersebut:
    *   **MySQL DB Name** (contoh: `if0_37373_portofolio`)
    *   **MySQL User Name** (contoh: `if0_37373`)
    *   **MySQL Host Name** (contoh: `sql123.infinityfree.com`)
    *   **Password**: Password akun hosting/VistaPanel Anda.

6.  Buka **phpMyAdmin** (melalui Control Panel).
7.  Pilih database yang baru dibuat.
8.  Klik tab **Import**, pilih file `backend/database.sql`, lalu klik **Go**.

---

## Tahap 3: Upload File ke InfinityFree

Gunakan fitur **Online File Manager** di InfinityFree atau aplikasi FTP (seperti FileZilla) agar lebih cepat.

### 1. Upload Backend (Folder API)
1.  Buka File Manager, masuk ke folder `htdocs`.
2.  Buat folder baru dengan nama `api`.
3.  Masuk ke folder `api`.
4.  Upload **seluruh isi folder `backend`** dari komputer Anda ke sini.
    *   Pastikan file `.htaccess` yang ada di dalam folder `backend` ikut terupload.
    *   Pastikan ada folder `uploads` di dalamnya. Jika belum ada, buat manual dan set permission (klik kanan -> chmod) ke `777`.

### 2. Konfigurasi Koneksi Database
1.  Di dalam folder `htdocs/api/config`, edit file `db.php`.
2.  Ubah bagian koneksi dengan data dari Tahap 2:
    ```php
    // Cari bagian ini dan sesuaikan
    $this->host = 'sqlxxx.infinityfree.com';      // Host Name
    $this->db_name = 'if0_xxxxxx_portofolio';     // DB Name
    $this->username = 'if0_xxxxxx';               // User Name
    $this->password = 'password_anda';            // Password VPanel
    ```
3.  Simpan file.

### 3. Upload Frontend
1.  Kembali ke folder `htdocs` (Root).
2.  Buka folder `frontend/dist` di komputer Anda.
3.  Upload **seluruh isi** folder `dist` ke dalam `htdocs`.
    *   Anda akan melihat `index.html`, folder `assets`, dll di sebelah folder `api`.

### 4. Upload Routing Utama
1.  Di komputer Anda, buka folder `deployment`.
2.  Ada file bernama `root.htaccess`.
3.  Upload file ini ke folder `htdocs`.
4.  **Rename (Ganti Nama)** file tersebut menjadi `.htaccess` (tambahkan titik di depan).
    *   File ini berfungsi agar saat Anda membuka halaman `/projects` atau `/admin`, server tidak error, melainkan memuat React App.

---

## Tahap 4: Selesai & Testing

1.  Buka website Anda: `https://iname.page.gd` (sesuai domain Anda).
2.  Halaman depan portofolio harus muncul.
3.  Coba akses `https://iname.page.gd/api/projects`. Anda harusnya melihat data JSON (walaupun kosong).
4.  Coba login ke admin (`/admin/login`).
    *   Username: `admin`
    *   Password: `password123`
5.  Coba upload gambar project.

### Troubleshooting
*   **Halaman putih / 404 pada menu**: Pastikan file `.htaccess` di root `htdocs` sudah benar (dari `deployment/root.htaccess`).
*   **Gagal Login / API Error**: Cek kembali `htdocs/api/config/db.php`. Pastikan password dan nama database benar.
*   **Gambar gagal upload**: Cek permission folder `htdocs/api/uploads`. Klik kanan folder tersebut di File Manager -> Change Permissions -> Centang semua (777).
