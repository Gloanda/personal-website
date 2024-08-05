---
title: "SOLID Principle and its Implementation"
summary: "Explaining SOLID principle and their example."
date: "May 10 2023"
draft: false
tags: 
- PPL
- Programming
---

Membuat kode yang _maintainable_ merupakan sebuah tantangan bagi seorang _software developer_. Kode yang _maintainable_ akan memudahkan proses _development_ baik untuk sekarang maupun di masa depan. Pada artikel ini, akan dibahas pembuatan kode yang _maintainable_ dengan menerapkan SOLID _principle_.

**SOLID Principle**

SOLID adalah kumpulan prinsip desain software yang diusung oleh Robert C Martin. SOLID bertujuan untuk membantu developer dalam menciptakan code yang mudah untuk di-develop dan di-maintain. SOLID terdiri dari 5 prinsip yaitu

*   **S** - Single Responsibility Principle
*   **O** - Open/Closed Principle
*   **L** - Liskov Substitution Principle
*   **I** - Interface Segregation Principle
*   **D** - Dependency Inversion Principle

Untuk membantu dalam memahami SOLID principle, artikel ini akan membahas setiap prinsip SOLID beserta dengan contoh penerapannya

**Single Responsibility Principle**

Prinsip ini menyatakan bahwa sebuah class (dan function) hendaknya memiliki **satu dan hanya satu tanggung jawab**. Dengan kata lain, sebuah class (dan function) hendaknya hanya memiliki **satu alasan untuk berubah**.

```python
def get_loan_product_list(
        self,
        product_id: str = None,
        product_name: str = None,
        description: str = None,
        category: str = None,
        create_date_start: str = None,
        create_date_end: str = None,
        update_date_start: str = None,
        update_date_end: str = None
):
    query = Q()
    dateformat = '%Y-%m-%d'
    if product_id:
        query &= Q(id__icontains=product_id)
    if product_name:
        query &= Q(name__icontains=product_name)
    if description:
        query &= Q(description__icontains=description)
    if category:
        query &= Q(category__icontains=category)
    try:
        if create_date_start:
            create_date_start = datetime.strptime(create_date_start, dateformat)
            query &= Q(create_date__gte=create_date_start)
        if create_date_end:
            create_date_end = datetime.strptime(create_date_end, dateformat) + timedelta(days=1)
            query &= Q(create_date__lte=create_date_end)
        if update_date_start:
            update_date_start = datetime.strptime(update_date_start, dateformat)
            query &= Q(update_date__gte=update_date_start)
        if update_date_end:
            update_date_end = datetime.strptime(update_date_end, dateformat) + timedelta(days=1)
            query &= Q(update_date__lte=update_date_end)
    except ValueError:
        raise HttpError(400, "Invalid date format. Use YYYY-MM-DD.")

    loan_products = LoanProduct.objects.filter(query).annotate(
        created_date=Cast(TruncMinute("create_date"), CharField()),
        updated_date=Cast(TruncMinute("update_date"), CharField())
    )
    return list(loan_products)
```

Untuk melihat penerapannya, perhatikan kode diatas. _Function_ pada kode diatas merepresentasikan API _get loan product list_. _Function_ tersebut juga bertanggung jawab terhadap proses _filter_ dari _loan product list_. Hal tersebut menyalahi _single responsibility principle_ karena jika kita ingin mengubah mekanisme dari _filter_ (menambah atribut _filter_, dsb) maka kita harus mengubah _function get loan product list_.

Kita dapat mengatasi hal tersebut dengan memisahkan filter dari function get loan product list. Sehingga jika kita ingin mengubah mekanisme filter, kita hanya perlu mengubah function filter. Berikut contoh solusinya

```python
def get_filtered_objects(model, query, dateformat, **kwargs):
    try:
        if kwargs.get('create_date_start'):
            create_date_start = datetime.strptime(kwargs.pop('create_date_start'), dateformat)
            query &= Q(create_date__gte=create_date_start)
        if kwargs.get('create_date_end'):
            create_date_end = datetime.strptime(kwargs.pop('create_date_end'), dateformat) + timedelta(days=1)
            query &= Q(create_date__lte=create_date_end)
        if kwargs.get('update_date_start'):
            update_date_start = datetime.strptime(kwargs.pop('update_date_start'), dateformat)
            query &= Q(update_date__gte=update_date_start)
        if kwargs.get('update_date_end'):
            update_date_end = datetime.strptime(kwargs.pop('update_date_end'), dateformat) + timedelta(days=1)
            query &= Q(update_date__lte=update_date_end)
    except ValueError:
        raise HttpError(400, "Invalid date format. Use YYYY-MM-DD.")
    for key, value in kwargs.items():
        if value:
            query &= Q(**{key + '__icontains': value})
    objects = model.objects.filter(query).annotate(
        created_date=Cast(TruncMinute("create_date"), CharField()),
        updated_date=Cast(TruncMinute("update_date"), CharField())
    )
    return objects

def get_loan_product_list(
        self,
        product_id: str = None,
        product_name: str = None,
        description: str = None,
        category: str = None,
        create_date_start: str = None,
        create_date_end: str = None,
        update_date_start: str = None,
        update_date_end: str = None
):
    query = Q()
    dateformat = '%Y-%m-%d'
    loanproducts = get_filtered_objects(LoanProduct, query, dateformat, id=product_id, name=product_name,
                                        description=description, category=category,
                                        create_date_start=create_date_start,
                                        create_date_end=create_date_end, update_date_start=update_date_start,
                                        update_date_end=update_date_end)
    return list(loanproducts)
```

**Open/Closed Principle**

Prinsip ini menyatakan bahwa sebuah class atau function seharusnya terbuka untuk ekstensi tetapi tertutup untuk modifikasi. Artinya, ketika ada perubahan dalam kebutuhan atau fungsi, developer seharusnya dapat menambahkan fitur baru tanpa memodifikasi kode yang sudah ada.

Untuk melihat contoh penerapannya, kita bisa melihat function API get_loan_product_list sebelumnya. Misalkan kita ingin menambahkan fungsionalitas baru seperti pagination pada API tersebut. Bagaimana caranya agar kita dapat mengimplementasikan pagination tanpa mengubah kode yang sudah ada? Salah satu caranya adalah dengan menggunakan decorator pattern. Pada kasus ini saya menggunakan decorator pattern yaitu paginate dari package yang saya gunakan untuk membuat API yaitu django-ninja

```python
@paginate()
def get_loan_product_list(
        self,
        product_id: str = None,
        product_name: str = None,
        description: str = None,
        category: str = None,
        create_date_start: str = None,
        create_date_end: str = None,
        update_date_start: str = None,
        update_date_end: str = None
):
    query = Q()
    dateformat = '%Y-%m-%d'
    loanproducts = get_filtered_objects(LoanProduct, query, dateformat, id=product_id, name=product_name,
                                        description=description, category=category,
                                        create_date_start=create_date_start,
                                        create_date_end=create_date_end, update_date_start=update_date_start,
                                        update_date_end=update_date_end)
    return list(loanproducts)
```

**Liskov Substitution Principle**

Prinsip ini menyatakan bahwa sebuah objek dari kelas _child_ harus dapat digunakan sebagai pengganti objek dari kelas _parent_ tanpa mengubah perilaku program. Dalam kata lain, objek _child_ harus memiliki semua perilaku yang dimiliki oleh objek _parent_.

Sebagai contoh, perhatikan dua model (LoanProduct dan Section) yang merupakah turunan dari django Model dan mempunyai str function

```python
class LoanProduct(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    create_date = models.DateTimeField(default=timezone.now)
    update_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Loan product - {self.name}"

class Section(models.Model):
    name = models.CharField(max_length=100)
    minimum_score = models.PositiveIntegerField(null=True, blank=True, default=0)
    create_date = models.DateTimeField(default=timezone.now)
    update_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Section - {self.name}"
```

Berdasarkan LiskovΓÇÖs Substitution Principle, kita seharusnya dapat menggunakan instance dari django Model di mana saja instance dari LoanProduct atau Section diharapkan. Misalnya, kita dapat menentukan fungsi yang menerima instance django Model sebagai argumen dan mencetak instance tersebut:

```python
def print_model(model):  
  print(model)
```

Kemudian kita membuat instance dari model LoanProduct dan Section yang keduannya melakukan override terhadap method str sehingga kita dapat memangil fungsi print\_model menggunakan instance dari model LoanProduct dan Section tanpa ada masalah

```python
loanproduct = LoanProduct.objects.create(name="Modal Usaha")  
section = Cat.objects.create(name="Ekonomi")  
  
print_model(loanproduct)  # outputs: Loan product - Modal Usaha  
print_model(section)  # outputs: Section - Ekonomi
```

**Interface Segregation Principle**

Prinsip ini menyatakan bahwa sebuah klien hanya boleh bergantung pada interface yang dibutuhkannya, dan tidak boleh bergantung pada interface yang tidak dibutuhkan. Dalam kata lain, kita harus memisahkan interface yang berbeda-beda dalam kelas yang terpisah agar klien hanya menggunakan interface yang dibutuhkannya.

Sebagai contoh, perhatikan implementasi dari view pada django digunakan untuk meng-handle upload file seorang applicant

```python
class UploadApplicantFileView(View):  
    def get(self, request):  
        # handle get  
    def post(self, request):  
        # handle post  
    def update(self, request):  
        # handle update  
    def delete(self, request):  
        # handle delete
```

Class diatas melanggar Interface Segregation Principle karena ΓÇÿmemaksaΓÇÖ klien untuk bergantung pada interface yang tidak dibutuhkan (dalam hal ini interface update dan delete). Solusinya adalah kita mengimplementasikan view hanya dengan interface yang dibutuhkan saja

```python
class UploadApplicantFileView(View):  
    def get(self, request):  
        # handle get  
    def post(self, request):  
        # handle post
```

**Dependency Inversion Principle**

Prinsip ini menyetakan bahwa sebuah kelas sebaiknya bergantung pada abstraksi. Dengan kata lain, prinsip ini menekankan bahwa kelas-kelas yang lebih tinggi tidak seharusnya bergantung pada kelas-kelas yang lebih rendah dalam sistem.

Sebagai contoh, perhatikan kode berikut dimana terjadi pelanggaran terhadap Dependency Inversion Principle.

```python
class PostgreSQLConnection:  
    def connect(self):  
        # Handle database connection  
        return "Database Connection"  
  
class ModelApp:  
    def __init__(self, connection : PostgreSQLConnection):  
        # self connection  
        self.connection = connection
```

ModelApp pada kode diatas bergantung kepada implementasi low level class yaitu PostgreSQLConnection. Hal tersebut melanggar Dependency Inversion Principle. Untuk dapat mengatasi hal tersebut, kita dapat memanfaatkan abastraksi sehingga high level class seperti ModelApp dapat bergantu pada abstraksi. Berikut adalah contoh solusinya

```python
class Connection:  
    def connect():  
        pass  
  
class PostgreSQLConnection(Koneksi):  
    def connect():  
        # Logic untuk menghandle database connection  
        return "Database Connection"  
  
class ModelApp:  
    def __init__(self, connection : Connection):  
        # self connection  
        self.connection = connection
```

**Kesimpulan**

SOLID principle adalah seperangkat prinsip-prinsip perancangan software yang bertujuan untuk memudahkan pengembangan, pemeliharaan, dan perubahan kode. Prinsip-prinsip tersebut terdiri dari Single Responsibility Principle (SRP), Open-Closed Principle (OCP), Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP), dan Dependency Inversion Principle (DIP).

Dengan mengikuti SOLID principle, software developer dapat memperbaiki kualitas kode mereka, meningkatkan modularitas dan memudahkan perubahan di masa depan. Prinsip-prinsip tersebut membantu software developer membangun aplikasi yang lebih mudah diuji, dipelihara, dan ditingkatkan. Oleh karena itu, SOLID principle sangat penting bagi setiap software developer untuk dipahami dan diterapkan dalam praktek mereka.