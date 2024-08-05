---
title: "Agile, Scrum, and its Implementation"
summary: "Explanation about agile and scrum."
date: "Apr 12 2023"
draft: false
tags: 
- PPL
- Agile
---

Sebagai _software developer_, kita pastinya sudah tak asing dengan kata _agile_ dan _scrum_. Namun, apakah kedua hal tersebut sudah benar-benar dipahami? Pada artikel ini, saya akan membahas metodologi _agile_ dan _scrum_ serta penerapannya pada proyek PPL yang sedang saya kerjakan.

**Agile Methodology**

> _Agile is an iterative approach to project management and software development that helps teams deliver value to their customers faster and with fewer headaches. - Atlassian_

Berdasarkan definisi tersebut, kita dapat menyimpulkan bahwa _agile_ adalah metodologi manajemen proyek perangkat lunak yang bertujuan untuk menghasilkan perangkat lunak dengan cepat dan efisien secara inkremental. Penerapan _agile_ juga membuat pengembangan perangkat lunak menjadi lebih adaptif terhadap perubahan yang muncul.

**The Agile Manifesto**

_Agile Manifesto_ adalah prinsip-prinsip dasar yang menjadi panduan dalam pengembangan _software_ menggunakan metodologi _agile_. Prinsip-prinsip tersebut meliputi:

*   **Individuals and interactions** over processes and tools
*   **Working software** over comprehensive documentation
*   **Customer collaboration** over contract negotiation
*   **Responding to change** over following a plan

**Scrum as Framework of Agile**

Pada proyek PPL, kami menerapkan scrum dalam mengembangkan aplikasi. Scrum merupakan sebuah metodologi yang menerapkan prinsip-prinsip utama agile dalam pengembangan sebuah aplikasi yang pada prosesnya cenderung adaptif dan senantiasa berubah. Selama pengembangan aplikasi, kami mengikuti scrum pillar dan scrum value.

![Three Pillars of Scrum (productmint.org)](https://productmint.com/wp-content/uploads/2019/09/3-Pillars.jpg)

**Transparency**  
Transparasi berarti semua orang di tim harus jelas tentang apa yang sedang dikerjakan dan apa yang harus dilakukan selanjutnya. Ini melibatkan membuka komunikasi antara semua anggota tim sehingga tidak ada informasi yang disembunyikan atau disimpan secara eksklusif oleh satu orang. Pada proyek PPL, kami menerapkan hal ini melalui scrum board yang memungkinkan anggota tim untuk mengetahui apa saja yang sudah diselesaikan.

Scrum Board pada Proyek PPL

**Inspection**  
Inspeksi mengacu pada peninjauan dan evaluasi proyek. Hal ini memungkinkan tim untuk mengidentifikasi masalah atau risiko pada tahap awal, dan memungkinkan tim untuk mengambil tindakan segera untuk menyelesaikan masalah tersebut. Pada proyek PPL, kami menerapkan hal ini melalui tindakan evaluasi yang dilakukan pada sprint retrospective.

**Adaptation**  
Adaptasi mengacu pada kemampuan tim untuk merespons perubahan dengan cepat dan efektif. Ini melibatkan penyesuaian rencana dan prioritas untuk mengatasi perubahan yang terjadi pada proyek. Dengan adaptasi, tim dapat memastikan bahwa produk yang dihasilkan tetap sesuai dengan tujuan dan memenuhi kebutuhan pelanggan. Pada proyek PPL, kami ditutuntut untuk dapat adaptif selama proses pengembangan melalui revisi-revisi aplikasi yang dilakukan setelah mendapat feedback dari klien pada sprint review.

![Scrum Values (scrum.org)](https://scrumorg-website-prod.s3.amazonaws.com/drupal/inline-images/2019-06/ScrumValues-1000.png)

**Scrum Actors**

Scrum Actors adalah para pihak yang terlibat dalam proses pengembangan software dengan metode Scrum. Ada tiga peran utama dalam Scrum: Product Owner, Scrum Master, dan Developer.

**Product Owner** bertanggung jawab atas visi produk dan mengelola Backlog Produk. Mereka berinteraksi dengan stakeholder untuk memahami kebutuhan mereka dan menetapkan prioritas untuk backlog produk. Pada proyek PPL kami, yang berperan sebagai _product owner_ adalah asisten dosen.

**Scrum Master** merupakan fasilitator tim yang membantu anggota tim memahami kerangka kerja Scrum serta memastikan agar proses Scrum berjalan dengan baik. Scrum master bertanggung jawab dalam memastikan setiap anggota tim menjalankan tugasnya dengan baik tanpa ada hambatan. Scrum master juga berperan dalam memimpin jalannya _meeting_ pada scrum event. Role scrum master dapat bersifat fleksibel. Pada proyek PPL kami, role ini dipegang oleh anggota yang berbeda setiap sprintnya.

**Developer** adalah kelompok orang-orang multidisiplin yang melakukan pekerjaan teknis dalam pengembangan software. Sebagai developer pada proyek PPL, kami mengerjakan item dari backlog produk selama Sprint dan berkolaborasi secara teratur dalam scrum event untuk mencapai tujuan bersama.

Saat bekerja sama menggunakan pendekatan Agile seperti Scrum, setiap peran harus saling mendukung dan memiliki tanggung jawab masing-masing sehingga dapat mencapai tujuan bersama secara efektif.

**Scrum Events**

Setiap iterasi dari scrum disebut sebagai sprint. Penerapan sprint ini cukup fleksibel tanpa ada ketentuan khusus. Pada proyek PPL kami, masa development dibagi menjadi tiga sprint dengan setiap sprint berdurasi empat minggu. Pada setiap sprint terdapat berbagai event yang dilakukan secara rutin guna menunjang jalannya scrum.

**Sprint planning,** yang diadakan setiap awal sprint. Pada tahap ini kami berdiskusi dengan klien untuk menentukan backlog yang akan dikerjakan pada sprint ini. Setelah itu kami membreakdown backlog tersebut menjadi task yang lebih kecil dan menentukan bobot setiap task tersebut. Terdapa banyak cara untuk menentukan bobot (story point) task. Pada proyek PPL, kami menggunakan poker planning. Penentuan bobot tersebut bertujuan untuk memudahkan pembagian tugas setiap anggota.

**Daily scrum**, dilakukan setiap minggu selama sprint berjalan. Implementasi tahap ini bersifat fleksibel. Pada proyek PPL, kami melaksanakan daily scrum dua kali seminggu. Daily scrum umumnya berdurasi 15ΓÇô30 menit dan digunakan untuk membahas hal-hal yang terjadi selama pengembangan seperti apa saja yang sudah dikerjakan, rencana yang akan dikerjakan, dan hambatan selama proses pengembangan. Kami juga memanfaatkan scrum board dalam kegiatan ini.

**Sprint review,** yang diadakan setiap akhir sprint. Pada tahap ini kami berdiskusi dengan klien untuk mendemokan aplikasi hasil pengembangan satu sprint sebagai _deliverable._ Pada tahap ini juga dilakukan, User Acceptance Test (UAT) dan pengumpulan feedback dari klien.

**Sprint retrospective,** diadakan setiap akhir sprint. Pada tahap ini kami melakukan evaluasi atas kinerja dari scrum team selama satu sprint. Pada proyek PPL, kami melakukan tahap ini secara anonim agar lebih nyaman dalam menyampaikan evaluasi. Pada tahap ini, kami membahas hal-hal seperti kelebihan dan kekurangan selama satu sprint serta hal-hal yang harus dilakukan atau dihentikan.

Hal-hal buruk yang dievaluasi pada sprint retrospective

**Kesimpulan**

Penerapkan agile dan scrum memungkinkan kita untuk menghasilkan _software_ dengan cepat dan efisien secara inkremental. Metodologi tersebut juga memungkinkan kita menjadi lebih adaptif terhadap perubahan yang muncul. Tentunya untuk mendapatkan manfaat penuh dari metodologi tersebut, ada prinsip-prinsip yang harus diterapkan.