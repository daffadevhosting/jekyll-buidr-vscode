# Jekyll Buildr for VS Code

![Status](https://img.shields.io/badge/status-release-green)
![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/DaffaDev.jekyll-buildr?label=Marketplace)

Supercharge alur kerja Jekyll Anda langsung di dalam Visual Studio Code. Ekstensi **Jekyll Buildr** membawa kekuatan AI generatif dari web app Jekyll Buildr ke dalam editor kode favorit Anda.

---

## 🚧 Status Release

Fitur-fitur mungkin masih dalam pengembangan dan Anda mungkin akan menemukan bug. Masukan Anda sangat kami hargai!

## ✨ Fitur Utama

* **🤖 AI Post Generator**: Buat postingan blog baru dari sidebar. Cukup berikan judul, dan AI akan membuatkan konten Markdown yang relevan lengkap dengan *front matter*.
* **🧠 AI Component Generator (Sadar Konteks)**: Jalankan perintah untuk membuat komponen Jekyll. AI akan menggunakan file yang sedang Anda buka sebagai konteks untuk menghasilkan kode yang lebih relevan.
* **🚀 Jekyll Boilerplate**: Mulai proyek Jekyll baru dalam hitungan detik. Jalankan satu perintah untuk membuat seluruh struktur folder dan file dasar yang siap pakai.
* **👑 Generate Image with AI**: Interactive command to create Image using AI, with context awareness from the currently post title.
* **🔐 Sinkronisasi Login**: Login sekali menggunakan akun GitHub Anda, dan Anda akan terautentikasi di *webapp* dan ekstensi VS Code secara bersamaan, termasuk status akun Pro Anda.

---

## 🚀 Cara Menggunakan

### 1. Login
Untuk menggunakan fitur AI, Anda harus login terlebih dahulu.
1.  Buka *Command Palette* (`Ctrl+Shift+P` atau `Cmd+Shift+P`).
2.  Ketik dan jalankan `Jekyll Buildr: Login`.
3.  Ikuti proses autentikasi GitHub yang muncul. Ekstensi akan secara otomatis menyinkronkan status akun Anda.

### 2. Buat Proyek Jekyll Baru
Jika Anda memulai dari awal, gunakan perintah *boilerplate*.
1.  Buka folder yang kosong di VS Code.
2.  Jalankan perintah `Jekyll Buildr: Create Jekyll Boilerplate`.
3.  Konfirmasi tindakan Anda, dan seluruh struktur proyek Jekyll akan dibuat secara otomatis.

### 3. Buat Postingan Baru dengan AI
Gunakan sidebar untuk membuat konten dengan cepat.
1.  Buka ikon Jekyll Buildr di *Activity Bar*.
2.  Di panel "Create Post", isi **Judul** dan detail lainnya.
3.  Klik tombol "Generate & Create Post".
4.  Ekstensi akan membuat dan membuka file `.md` baru di dalam folder `_posts/`.

### 4. Buat Komponen dengan AI
1.  (Opsional) Buka file yang relevan (misalnya, `_layouts/default.html`) untuk memberikan konteks pada AI.
2.  Jalankan perintah `Jekyll Buildr: Generate AI Component`.
3.  Masukkan deskripsi komponen yang Anda inginkan (misalnya, `a modern footer with social media links`).
4.  AI akan membuat file yang sesuai (misalnya, `_includes/footer.html`) dan membukanya untuk Anda.

---

## 📚 Daftar Perintah

* `Jekyll Buildr: Login` - Mengautentikasi Anda dengan akun Jekyll Buildr.
* `Jekyll Buildr: Create Jekyll Boilerplate` - Membuat struktur proyek Jekyll standar.
* `Jekyll Buildr: Generate AI Component` - Membuat file komponen baru menggunakan AI.
* `Jekyll Buildr: Generate Image with AI 👑` - Membuat image untuk post blog menggunakan AI.

---

## 📄 Lisensi

Proyek ini dirilis di bawah Lisensi CC0 1.0 Universal.