# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Formatnya didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-beta.1] - 2025-08-21

### Added

* **Rilis Pratinjau Awal** dari Jekyll Buildr.
* **Fitur Inti Editor**: Editor kode berbasis web, file explorer (buat, hapus, ganti nama), dan manajemen file/folder.
* **Autentikasi Pengguna**: Sistem login dan registrasi menggunakan Firebase Authentication dengan penyedia GitHub.
* **Integrasi GitHub**:
    * Kemampuan untuk menginstal Aplikasi GitHub untuk otorisasi.
    * Memilih repositori dan cabang target dari halaman Pengaturan.
    * Fitur "Push to GitHub" untuk menyimpan perubahan langsung ke repositori.
    * Fitur "Create Pull Request" untuk alur kerja yang lebih aman.
* **Fitur AI (Generasi Awal)**:
    * `generatePostContent`: Membuat konten postingan blog dan kategori dari sebuah judul.
    * `generateJekyllComponent`: Membuat komponen HTML/Liquid (seperti `_includes` atau `_layouts`) dari deskripsi teks.
    * `generateImage`: Membuat gambar untuk postingan menggunakan model AI generatif.
* **Sistem Langganan Pro**:
    * Integrasi langganan bulanan menggunakan PayPal.
    * Perbedaan peran `freeUser` dan `proUser`.
    * Modal upgrade untuk pengguna gratis.
* **Manajemen Workspace (Fitur Pro)**:
    * Kemampuan untuk membuat beberapa *workspace* dengan mengimpor dari repositori GitHub yang berbeda.
    * Beralih antar *workspace* dari halaman dasbor.
* **Ekstensi VS Code**:
    * Sistem login yang disinkronkan dengan *webapp* melalui GitHub & Firebase.
    * Perintah `Jekyll Buildr: Create Jekyll Boilerplate` untuk membuat proyek baru dengan cepat.
    * Sidebar "Create Post" dengan fungsionalitas pembuatan konten AI.
    * Perintah `Jekyll Buildr: Generate AI Component` yang sadar konteks.

---