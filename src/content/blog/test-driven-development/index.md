---
title: "Test-Driven Development: The Key to High-Quality, Maintainable Software"
summary: "Explaining TDD implementation."
date: "Mar 23 2023"
draft: false
tags: 
- PPL
- TDD
---

Bagi para _software developer,_ mungkin istilah TDD sudah tidak asing lagi. Test-Driven Development atau disingkat TDD saat ini sudah banyak diterapkan pada proses pengembangan perangkat lunak. Namun sebenarnya apakah yang dimaksud dengan TDD? Apa saja manfaat yang bisa didapatkan jika kita menerapkan TDD?

**Apa itu TDD dan Apa Tujuannya?**  
Test-Driven Development (TDD) merupakan sebuah metodologi dalam proses pengembangan perangkat lunak dimana _developer_ didorong untuk menyusun _test_ sebelum membuat implementasi dari _software_. Hal ini bertujuan untuk menjamin implementasi yang telah dibuat sesuai dengan _requirement_ dan meminimalisir kemungkinan munculnya _bug_ dan _error_ pada kode yang dibuat.

**Bagaimana Cara Menerapkan TDD?**  
Sesuai dengan definisinya, untuk menerapkan TDD pada pengembangan _software_, kita harus membuat _test_ sebelum membuat implementasi fitur. Berdasarkan hal tersebut, alur dari TDD dapat dibagi menjadi 3, yaitu RED, GREEN, dan REFACTOR.

![Contoh penerapan TDD](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*KJ09VhTGkOo3_rtIX9cs4g.png)

**RED - Menyusun Test**

![Contoh penerapan penyusunan test pada tahap RED](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*jQ9gBJ8IuO5fdFd-ShwovQ.png)

![Test masih _failed karena belum ada implementasi_](https://miro.medium.com/v2/resize:fit:640/format:webp/1*bLWYb_GpzH7zJj6nf_shAQ.png)

Pada tahap ini, buat _test_ sesuai dengan ekspektasi fungsionalitas dari fitur yang akan dibuat. Seperti yang dapat dilihat pada gambar diatas, saya membuat _unit test_ terkait fitur _authentication_ sebuah _endpoint_ terlebih dahulu sebelum membuat implementasi fiturnya. Perhatikan bahwa _test_ ini akan _fail_ karena belum ada implementasi fiturnya.

**GREEN - Membuat Implementasi Fitur**

![Contoh penerapan implementasi pada tahap GREEN](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*o1A2Q67pmy4oy_dXedt0Xg.png)

![Test sudah _passed setelah fitur diimplementasi_](https://miro.medium.com/v2/resize:fit:640/format:webp/1*YFiFmLAtjJeLeMX9f5-7eA.png)

Kemudian pada tahap berikutnya, buat kode terkait implementasi fitur. Seperti yang dapat dilihat pada gambar diatas, saya membuat implementasi fitur authentication endpoint dengan fungsionalitas sesuai dengan yang diuji dalam _test_ yang sudah dibuat. Pastikan bahwa implementasi fitur ini berhasil melewati atau _pass_ semua test yang dibuat.

**REFACTOR - Memperbaiki Code**

Tidak jarang kode yang telah dibuat mempunyai masalah seperti _bug_ atau _code smell_. Perbaikan-perbaikan kode terkait masalah tersebut dapat dilakukan pada tahap ini. Sebagai contoh, setelah melalui kedua tahap sebelumnya, saya melakukan perbaikan _code smell_ dengan membuat variable untuk menampung duplicated string. Perhatikan bahwa perubahan kode yang dilakukan tidak mengubah fungsionalitas dari fitur yang dibuat dan tidak membuat _test_ menjadi _failed_.

**Repeat!**  
Ulangi ketiga langkah diatas setiap pembuatan fitur baru atau perubahan fungsionalitas fitur yang sudah dibuat.

**Manfaat dari Penerapan TDD**

1.  Meningkatkan kualitas kode  
    Dengan menulis _test_ terlebih dahulu, kita didorong untuk memikirkan secara matang fungsionalitas dari fitur yang akan diimplementasi. Jika _test case_ yang dibuat berkualitas dan berhasil meng-_cover_ setiap _behavior_ program, maka kita dapat dengan mudah menemukan dan memperbaiki cacat dalam kode sebelum kode diimplementasikan. Hal ini dapat mengurangi jumlah bug dan kesalahan dalam kode dan meningkatkan kualitas kode.
2.  Meningkatkan _maintainability_ kode  
    Dengan TDD, kita dapat lebih mudah dalam membuat perubahan pada kode karena terdapat _test_ yang dapat digunakan untuk memverifikasi bahwa perubahan tersebut tidak memengaruhi fungsionalitas lain dari kode. Hal ini dapat mengurangi risiko perubahan kode yang buruk dan membuat proses pengembangan lebih lancar dan teratur.
3.  Meningkatkan kolaborasi tim  
    Dengan TDD, kita dapat berkolaborasi dengan lebih baik dengan anggota tim lainnya. Hal itu karena kita yakin bahwa setiap kode yang dibuat anggota tim sudah memenuhi ekspektasi karena sudah melewati _test._

**Kesimpulan**  
Test-Driven Development (TDD) adalah metodologi dalam proses pengembangan perangkat lunak yang mendorong developer untuk menyusun test sebelum membuat implementasi dari software. Tujuan dari TDD adalah untuk menjamin implementasi yang telah dibuat sesuai dengan requirement dan meminimalisir kemungkinan munculnya bug dan error pada kode yang dibuat. Manfaat dari penerapan TDD antara lain meningkatkan kualitas kode, meningkatkan maintainability kode, dan meningkatkan kolaborasi tim.