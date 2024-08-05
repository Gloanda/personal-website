---
title: "Dockerizing a Django Application"
summary: "Docker explanation and how to containerize your Django app."
date: "May 25 2023"
draft: false
tags: 
- PPL
- Docker
---

Dalam dunia _software development_, kita pasti telah sering mendengar tentang Docker. Docker merupakan salah satu _tools_ populer yang sering digunakan dalam pengembangan _software_. Dengan menggunakan Docker, kita dapat meng-_containerize_ aplikasi kita, yang memungkinkan kita untuk menjalankannya secara konsisten di berbagai _environment_ tanpa harus khawatir tentang perbedaan konfigurasi atau dependensi yang tidak kompatibel. Dalam artikel ini, kita akan membahas tentang Docker dan penerapannya pada aplikasi Django.

**Understanding Docker and Containers**
---------------------------------------

**Docker** adalah platform open-source yang memungkinkan kita untuk meng-_containerize_ aplikasi kita dalam _container_ yang terisolasi. **_Container_** ini berisi semua dependensi yang diperlukan oleh aplikasi, termasuk sistem operasi, _library_, dan _runtime environment_. Dengan Docker, kita dapat memastikan bahwa aplikasi kita berjalan secara konsisten di berbagai _environment_, mulai dari tahap _development_ di _local_ hingga _production_.

**Advantages**
--------------

**Portability**  
Docker memungkinkan aplikasi untuk dijalankan dengan konsisten di berbagai _environment_, termasuk _environment development_, _staging_, dan _production_. Hal ini memungkinkan _developer_ untuk terhindar dari masalah yang disebabkan oleh perbedaan konfigurasi dan dependensi di _environment_ yang berbeda.

**Isolation**  
Setiap _container_ Docker berjalan secara terisolasi, yang berarti bahwa aplikasi dan dependensinya tidak saling mempengaruhi. Ini memastikan bahwa aplikasi yang dijalankan dalam suatu _container_ tidak akan terpengaruh oleh perubahan atau masalah di _environment_ tempat _container_ tersebut.

**Replication**  
Docker memungkinkan replikasi yang mudah dari suatu _environment_ ke environment lainnya. Kita dapat dengan cepat dan mudah membuat salinan identik dari _container_ Docker dengan memanfaatkan Docker _image_. Docker _image_ adalah _template_ yang berisi semua konfigurasi dan dependensi yang diperlukan untuk menjalankan aplikasi. _Image_ ini dapat disimpan dan dibagikan melalui repositori Docker, seperti Docker Hub atau repositori Docker pribadi.

**Disadvantages**
-----------------

**Overhead**  
Aplikasi yang dijalankan dengan menggunakan _container_ tentunya akan mengonsumsi lebih banyak _resource_ dibanding aplikasi yang dijalankan tanpa _container_. Walaupun, _container_ pada Docker lebih efisien dalam menggunakan _resource_ dibandingkan dengan _virtual machine_. Namun tetap saja penggunaan Docker dapat menyebabkan _overhead_ tambahan pada _resource_ sistem, terutama jika aplikasi yang dijalankan dalam _container_ Docker memiliki kebutuhan yang tinggi terhadap _resource_.

**Image Size**  
Docker _image_ bisa memiliki ukuran yang besar, terutama jika dependensi dan komponen yang diperlukan oleh aplikasi cukup banyak. Hal ini dapat mempengaruhi waktu pengunduhan dan penggunaan ruang penyimpanan.

**Security**  
Penggunaan Docker memperkenalkan risiko keamanan tambahan. Jika konfigurasi tidak benar, _container_ Docker dapat menjadi rentan terhadap serangan atau penyalahgunaan. Penting untuk mengadopsi _best practice_ dalam memastikan keamanan dalam penggunaan Docker. _Best practice_ tersebut meliputi mengunduh _image_ dari sumber yang terpercaya, _rebuild_ _image_ secara berkala, dan melakukan _vulnerability scanning_ pada _image_.

Dockerize Django Application
----------------------------

Bagian ini akan membahas langkah-langkah untuk menerapkan Docker pada project Django. Sebagai contoh, kita memiliki project Django dengan dependencies yang tertulis dalam file requirements.txt. Hal pertama yang kita lakukan untuk menerapkan Docker pada project kita adalah membuat Dockerfile. Dockerfile adalah file yang berisikan instruksi dalam membuat Docker image, termasuk informasi mengenai _operating system, languages, environmental variables, file locations, network ports,_ dan komponen lain yang diperlukan.

```dockerfile
FROM python:3  
RUN mkdir /app  
WORKDIR /app  
COPY requirements.txt /app/  
RUN pip install -r requirements.txt  
COPY . /app/
```

**FROM python:3**  
Baris ini menentukan _base image_ yang akan digunakan untuk membangun _image_ kita. Dalam kasus ini, kita menggunakan _image_ Python versi 3 sebagai _base image_.

**RUN mkdir /app**  
Baris ini membuat direktori baru bernama /app di dalam _container_.

**WORKDIR /app**  
Baris ini menetapkan direktori kerja (working directory) untuk _container_ ke /app. Ini berarti semua perintah berikutnya yang dijalankan dalam Dockerfile akan dilakukan di direktori /app.

**COPY requirements.txt /app/**  
Baris ini menyalin _file_ requirements.txt dari direktori lokal (di mana Dockerfile ini berada) ke direktori /app di dalam _container_.

**RUN pip install -r requirements.txt**  
Baris ini menjalankan perintah pip install di dalam _container_untuk menginstal semua dependensi yang terdaftar dalam _file_ requirements.txt.

**COPY . /app/**  
Baris ini menyalin seluruh isi dari direktori lokal (di mana Dockerfile ini berada) ke direktori /app di dalam _container_.

Dengan Dockerfile ini, kita dapat membangun _image_ Docker yang siap untuk menjalankan aplikasi Python di dalam _container_ Docker. Image ini akan berisi semua dependensi yang diperlukan oleh aplikasi kita yang terdaftar dalam file requirements.txt dan juga semua _file_ dan direktori yang ada di direktori lokal saat membangun _image_.

Langkah berikutnya yang harus kita lakukan adalah membuat _file_ docker-compose.yml di _root project_

```yml
version: "3.9"  
services:  
    web:  
        build: .  
        command: python manage.py runserver 0.0.0.0:8000  
        volumes:  
            - .:/app  
        ports:  
            - "8000:8000"
```

_Container_ sudah siap dijalankan dengan _command_ berikut

```
docker-compose up -d
```

Kita sudah berhasil menerapkan Docker pada aplikasi Django kita yang dapat diakses melalui [localhost:8000](http://localhost:8000/).

Kesimpulan
----------

Docker adalah sebuah platform open-source yang memungkinkan pengembang untuk meng-containerize aplikasi mereka dalam container yang terisolasi. Keuntungan utama Docker adalah portabilitas, isolasi, dan kemampuan untuk replikasi environment. Namun, kekurangan Docker meliputi overhead tambahan pada penggunaan resource sistem, ukuran image yang besar, dan risiko keamanan tambahan. Meskipun demikian, dengan mengikuti praktik terbaik dalam penggunaan Docker, seperti mengunduh image dari sumber yang terpercaya dan melakukan scanning keamanan, manfaat yang diperoleh dari penggunaan Docker dapat melebihi kerugian yang mungkin timbul.
