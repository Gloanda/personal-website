---
title: "Essential Tools for Collaborative Software Development"
summary: "Explaining tools that can enchance collaboration in software development."
date: "Mar 7 2023"
draft: false
tags: 
- PPL
- Collab
---

Di dunia pengembangan perangkat lunak, kolaborasi memainkan peran yang sangat penting dalam membangun aplikasi yang bermutu. Namun, seperti pedang bermata dua, kolaborasi yang buruk dapat berdampak negatif pada pengembangan aplikasi. Salah satu masalah utama dalam pengembangan perangkat lunak adalah kurangnya koordinasi tim, yang dapat mengakibatkan kurangnya visibilitas pada alur dan _progress_ pengembangan. Pada blog ini, saya akan membahas beberapa tools yang dapat membantu kita mencegah hal tersebut dan mendukung kolaborasi dalam _software development_ seperti _scrum board_, _commit message_, dan _merge request_.

Scrum Board
-----------

![Implementasi scrum board](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*mMgFkOKGgnnwMxRIqnMnWQ.png)

_Scrum board_ adalah alat yang dapat membantu kita mengorganisir dan memvisualisasikan _progress_ dari _sprint_. _Scrum board_ bersifat fleksibel dimana implementasinya dapat disesuaikan dengan keadaan dan kebutuhan _scrum team_. Scrum board dapat berbentuk fisik seperti papan tulis maupun berbentuk virtual yang terdapat pada _website_ atau aplikasi. _Scrum board_ dapat berisikan hal-hal simpel seperti daftar _task_, _to-do_, _in progress_, dan _completed_ maupun berisikan hal-hal kompleks dengan berbagai fitur tambahan seperti yang terintegrasi di Gitlab. Tujuannya tetap sama yaitu untuk menunjukan sudah sejauh mana progress dari _sprint_ dan hal-hal apa saja yang harus dikerjakan berikutnya.

Kita dapat melihat manfaat dari _scrum board_ melalui _scrum value_ yang terealisasikan oleh penerapan _scrum board_ seperti:

*   **Commitment**  
    Dengan menggunakan _scrum board_, tim dapat menentukan target _task-task_ yang diselesaikan dalam suatu _sprint_. Hal ini mendorong setiap anggota tim untuk lebih berkomitmen dalam menyelesaikan _task_.
*   **Focus**  
    Dengan menggunakan _scrum board_, tim dapat dengan mudah melihat _progress sprint_ dan menentukan prioritas _task_ yang paling penting. Hal ini dapat membantu memastikan bahwa setiap anggota tim fokus pada _task_ yang benar-benar penting dan menghindari terjadinya _multitasking_ yang tidak produktif.
*   **Openness**  
    Dengan menggunakan scrum board, tim dapat dengan mudah melihat _progress_ dan _blocker_ yang dihadapi oleh anggota tim lainnya. Dalam situasi seperti ini, tim dapat dengan mudah berkolaborasi dan membantu satu sama lain untuk mendapatkan solusi untuk masalah yang dihadapi.

Commit Message
--------------

![Implementasi commit message](https://miro.medium.com/v2/resize:fit:720/format:webp/1*hdV_ywEhnjZo6v4h9urQMA.png)

_Commit message_ adalah suatu teks yang mendeskripsikan maksud/tujuan dari sebuah commit. _Commit message_ merupakan salah satu cara komunikasi yang efektif dalam pengembangan perangkat lunak secara kolaboratif. _Commit message_ membantu kita dalam menyampaikan _progress_ dan perubahan pada kode yang kita buat. Hal tersebut akan memudahkan orang lain untuk membaca dan me-_review_ hasil pekerjaan kita.

Berikut adalah beberapa _best practice_ yang dapat diterapkan dalam penulisan _commit message:_

*   **Deskriptif**  
    Sebuah _commit message_ hendaknya dapat menyampaikan perubahan apa saja yang terjadi dalam suatu _commit_ dengan baik. _Commit message_ yang deskriptif akan membantu orang lain dan diri kita sendiri untuk mengetahui perubahan yang dilakukan dalam commit tanpa harus melihat ke dalam kode. Salah satu contohnya adalah menerapkan _semantic commit message_, yaitu menuliskan tag terkait jenis perubahan yang dilakukan pada _commit message_ (red, green, feat, fix, chores).
*   **Konsisten**  
    Penulisan _commit message_ hendaknya konsisten mengikuti suatu konvensi yang telah ditentukan. Hal ini bertujuan untuk meminimalisir perbedaan persepsi atas maksud dari _commit message_ akibat perbedaan konvensi yang diikuti. _Commit message_ yang konsisten sesuai konvensi juga akan memudahkan kita menelusuri histori _commit_ menggunakan fitur seperti git log.

Merge Request
-------------

_Merge request_ adalah sebuah permintaan untuk dapat melakukan _merge_ _commit-commit_ yang telah dibuat ke _branch_ utama. _Merge request_ memungkinkan _developer_ lain dalam tim untuk meninjau perubahan tersebut dan memberikan umpan balik sebelum kode sumber tersebut digabungkan ke dalam _branch_ utama. Dengan menggunakan _merge request_, tim dapat memastikan bahwa kode yang akan diintegrasikan telah diuji dan disetujui oleh anggota tim yang lain sebelum diimplementasikan ke dalam proyek.

Berikut adalah beberapa _best practice_ saat menerapkan _merge request_:

*   **Buat deskripsi yang jelas**  
    Deskripsi _merge request_ harus jelas dan singkat agar memudahkan anggota tim lain untuk memahami perubahan kode yang diusulkan.
*   **Tes terlebih dahulu**  
    Sebelum membuat _merge request_, pastikan kode telah diuji dengan baik untuk mengurangi risiko munculnya _bug_ dan masalah pada kode.
*   **Lakukan _merge_ dengan cepat**  
    Setelah _merge request_ diterima, merge harus segera dilakukan untuk mencegah terjadinya konflik dengan perubahan kode lainnya dan agar tidak menghambat pekerjaan anggota tim lainnya.
*   **Lakukan _review_ secara menyeluruh**  
    Pastikan untuk mengecek secara rinci setiap perubahan pada _merge request_. Hal ini untuk menjamin agar tidak terdapat kesalahan pada kode yang akan diintegrasikan ke _branch_ utama. Jangan lupa untuk memberikan kritik dan masukan yang konstruktif jika memang terdapat kesalahan pada kode.

Berikut adalah contoh merge request pada proyek PPL yang sedang saya kerjakan

![Penerapan merge request](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*mOMEa3cfNPFtYPzvijQk-Q.png)

**Kesimpulan**

Kolaborasi yang baik sangat penting dalam pengembangan perangkat lunak, namun kurangnya koordinasi tim dapat menyebabkan dampak negatif pada progress dan visibilitas pengembangan. Untuk mencegah hal ini, terdapat beberapa tools yang dapat digunakan, seperti scrum board, commit message, dan merge request. Scrum board membantu mengorganisir dan memvisualisasikan progress sprint, mendorong komitmen, fokus, dan keterbukaan dalam tim. Commit message membantu menyampaikan progress dan perubahan kode dengan deskriptif dan konsisten, memudahkan kolaborasi dan review. Merge request memungkinkan anggota tim untuk meninjau dan memberikan umpan balik sebelum menggabungkan perubahan kode ke dalam branch utama. Dengan menerapkan praktik terbaik dalam penggunaan tools ini, kolaborasi dalam pengembangan perangkat lunak dapat ditingkatkan dan hasil yang lebih baik dapat dicapai.
