---
title: "Building a Multi Tenant Django Application"
summary: "Different approaches to building a multi tenant Django app."
date: "May 26 2023"
draft: false
tags: 
- PPL
- Django
---

Di zaman modern ini, mayoritas aplikasi _Software as a Service_ modern adalah aplikasi _multi tenant_. Contohnya seperti Salesforce, Freshbooks, Zoho dan Wordpress. Aplikasi-aplikasi tersebut merupakan aplikasi _cloud based_ yang mengadopsi arsitektur _multi tenant_. Dalam artikel ini, kita akan membahas tentang apa itu aplikasi _multi tenant_ dan bagaimana cara membuat sebuah aplikasi Django dengan arsitektur _multi tenant_.

Apa itu Multi-Tenant Application?
---------------------------------

_Multi tenant application_ adalah paradigma di mana satu _instance_ aplikasi dapat melayani beberapa customer atau tenant secara bersamaan. Setiap customer memiliki lingkungan yang terisolasi dalam aplikasi, yang berarti data dan konfigurasi mereka dipisahkan satu sama lain. Ini memungkinkan beberapa organisasi atau pengguna untuk menggunakan aplikasi yang sama, tetapi dengan sumber daya dan data yang terpisah.

**Keuntungan Multi-Tenant Application**
---------------------------------------

Pendekatan multi-tenancy memiliki sejumlah keuntungan, terutama dalam konteks aplikasi web. Beberapa keuntungan tersebut antara lain:

**Efisiensi Sumber Daya  
**Dalam arsitektur multi-tenant, sumber daya seperti server, database, dan infrastruktur lainnya dapat digunakan secara lebih efisien karena dapat dibagi di antara beberapa tenant.

**Development dan Maintenance yang Mudah**  
Dengan menggunakan satu _codebase_ untuk semua tenant, development, maintenance, dan peningkatan aplikasi dapat dilakukan dengan lebih mudah dan efisien. Perubahan yang diterapkan di satu bagian aplikasi akan mencerminkan pada semua tenant.

**Cost yang Lebih Rendah**  
Dengan membagi sumber daya dan infrastruktur di antara banyak tenant, biaya pengembangan dan operasional dapat dikurangi secara signifikan. Hal ini membuat model bisnis yang lebih terjangkau, terutama untuk perusahaan kecil dan menengah.

Mengimplementasikan Multi-Tenancy pada Django Application
---------------------------------------------------------

Dalam mengimplementasikan arsitektur multi tenant, terdapat beberapa pendekatan yang dapat dipilih yaitu:

*   Shared database with shared schema  
    Pada pendekatan ini, setiap data tenant disimpan dalam satu database dan schema yang sama. Foreign key dapat digunakan untuk membedakan tenant dari data.
*   Shared database with isolated schema  
    Pada pendekatan ini, setiap data tenant disimpan dalam satu database. Setiap tenant yang berbeda akan mempunyai schema sendiri untuk menyimpan data-data tenant.
*   Isolated database with a shared app server  
    Pada pendekatan ini, setiap tenant yang berbeda disimpan dalam database yang berbeda.

Artikel ini akan membahas akan membahas pembuatan multi tenant django application dengan pendekatan **Shared database with shared schema**. Sebagai contoh perhatikan code aplikasi django yang diambil dari proyek PPL yang sedang saya kerjakan.

```python
from django.db import models  
  
class Applicant(models.Model):  
    fullname = models.CharField(max_length=100)  
    surname = models.CharField(max_length=100, blank=True, null=True)  
    application_status = models.CharField(max_length=30, default="Pending")  
    gender = models.CharField(max_length=30)  
    birth_place = models.CharField(max_length=100)  
    birth_date = models.DateField()
```

Untuk menerapkan multi tenant, hal pertama yang bisa kita lakukan adalah membuat model yang merepresentasikan Tenant

```python
class Tenant(models.Model):  
    name = models.CharField(max_length=100)  
    subdomain_prefix = models.CharField(max_length=100, unique=True)
```

Setelah itu, kita membuat abstract class TenantAwareModel sehingga kita dapat mengimplementasikan multi tenant pada model lain

```python
class TenantAwareModel(models.Model):  
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)  
  
    class Meta:  
        abstract = True
```

```python
class Applicant(TenantAwareModel):  
    # ...
```

Kita harus menentukan bagaimana aplikasi kita dapat mengindentifikasi suatu tenant. Salah satu cara yang sering digunakan adalah dengan melalui subdomain. Sebagai contoh, aplikasi kita memiliki domain

[www.loan-origination.com](http://www.loan-origination.com)

Kita dapat membagi tenant yang berbeda ke subdomain yang berbeda:

*   pusat.loan-origination.com
*   cabang.loan-origination.com

subdomain ini nantinya akan disimpan dalam field subdomain\_prefix pada model Tenant.

Untuk mendapatkan tenant dari request, kita dapat memanfaatkan Host header dari request pada Django. Kita dapat membuat utility method di file utils.py untuk melakukan ekstraksi tenant dari request.

```python
from .models import Tenant  
  
  
def hostname_from_request(request):  
    # split on \`:\` to remove port  
    return request.get_host().split(':')[0].lower()  
  
  
def tenant_from_request(request):  
    hostname = hostname_from_request(request)  
    subdomain_prefix = hostname.split('.')[0]  
    return Tenant.objects.filter(subdomain_prefix=subdomain_prefix).first()
```

Sekarang kita bisa mengkonfigurasikan view dari aplikasi kita untuk menghandle request dari tenant yang berbeda

```python
from tenants.utils import tenant_from_request  
  
  
class ApplicantViewSet(viewsets.ModelViewSet):  
    queryset = Applicant.objects.all()  
    serializer_class = ApplicantSerializer  
  
    def get_queryset(self):  
        tenant = tenant_from_request(self.request)  
        return super().get_queryset().filter(tenant=tenant)
```

Tidak hanya pada view, kita juga perlu melakukan isolasi berdasarkan tenant pada admin page Django. Kita dapat mengubah file admin.py menjadi seperti berikut

```python
@admin.register(Applicant)  
class ApplicantAdmin(admin.ModelAdmin):  
    fields = ["fullname", "application_status"]  
  
    def get_queryset(self, request, *args, **kwargs):  
        queryset = super().get_queryset(request, *args, **kwargs)  
        tenant = tenant_from_request(request)  
        queryset = queryset.filter(tenant=tenant)  
        return queryset  
  
    def save_model(self, request, obj, form, change):  
        tenant = tenant_from_request(request)  
        obj.tenant = tenant  
        super().save_model(request, obj, form, change)
```

Dengan perubahan tersebut, kita sudah memiliki aplikasi Django yang berbasis multi tenant.

Memisahkan Schema untuk Setiap Tenant
-------------------------------------

Pada bagian sebelumnya, kita telah membuat aplikasi multi tenant pada Django yang memisahkan tenant menggunakan ForeignKey. Cara tersebut mudah diimplementasikan, namun memiliki beberapa kekurangan yaitu **separasi data tenant yang lemah**. Hal tersebut karena data setiap tenant tetap berada dalam skema yang sama, tidak ada cara untuk membatasi akses ke data satu tenant di level database.

Untuk mengatasi hal tersebut, kita akan coba mengimplementasikan multi tenant application menggunakan pendekatan **shared database with isolated schema.**

Kita perlu memiliki cara untuk memetakan tenant dengan skema. Ada beberapa cara yang dapat dilakukan, misalnya dengan menyimpan tabel dalam skema publik yang memetakan URL tenant ke skema. Pada artikel ini, kita akan melakukan pemetaan sederhana antara URL penyewa dengan skema menggunakan map dari python. Tambahkan kode berikut di utils.py

```python
def get_tenants_map():  
    return {  
        "pusat.loan-origination.com": "pusat",  
        "cabang.loan-origination.com": "cabang",  
    }
```

Selanjutnya kita perlu menambahkan kode yang dapat membantu kita untuk melakukan get dan set schema berdasarkan request. Tambahkan kode berikut pada file utils.py

```python
def hostname_from_request(request):  
    # split on \`:\` to remove port  
    return request.get_host().split(':')[0].lower()  
  
  
def tenant_schema_from_request(request):  
    hostname = hostname_from_request(request)  
    tenants_map = get_tenants_map()  
    return tenants_map.get(hostname)  
  
  
def set_tenant_schema_for_request(request):  
    schema = tenant_schema_from_request(request)  
    with connection.cursor() as cursor:  
        cursor.execute(f"SET search\_path to {schema}")
```

Kita dapat memanfaatkan method set dan get tenant dari request tersebut pada view dan admin.

```python
from tenants.utils import set_tenant_schema_for_request, tenant_from_request  
  
class ApplicantViewSet(viewsets.ModelViewSet):  
    queryset = Applicant.objects.all()  
    serializer_class = ApplicantSerializer  
  
    def get_queryset(self):  
        set_tenant_schema_for_request(self.request)  
        tenant = tenant_from_request(self.request)  
        return super().get_queryset().filter(tenant=tenant)
```

```python
from tenants.utils import set_tenant_schema_for_request, tenant_from_request  
  
@admin.register(Applicant)  
class ApplicantAdmin(admin.ModelAdmin):  
    fields = ["fullname", "application_status"]  
  
    def get_queryset(self, request, *args, **kwargs):  
        set_tenant_schema_for_request(self.request)  
        queryset = super().get_queryset(request, *args, **kwargs)  
        tenant = tenant_from_request(request)  
        queryset = queryset.filter(tenant=tenant)  
        return queryset  
  
    def save_model(self, request, obj, form, change):  
        tenant = tenant_from_request(request)  
        obj.tenant = tenant  
        super().save_model(request, obj, form, change)
```

Dengan demikian kita telah mengimplementasikan _multi tenant_ pada aplikasi Django dengan pendekatan **shared database with isolated schema** yang membuat _tenant_ lebih terisolasi karena disimpan ke _schema_ yang berbeda.

Kesimpulan
----------

Dalam artikel ini, kita telah membahas tentang aplikasi _multi-tenant_ dan bagaimana mengimplementasikannya dalam aplikasi Django. Pendekatan _multi-tenancy_ memungkinkan satu _instance_ aplikasi untuk melayani beberapa _tenant_ secara bersamaan, dengan keuntungan efisiensi sumber daya, pengembangan yang mudah, dan biaya yang lebih rendah. Dalam konteks Django, terdapat beberapa pendekatan yang dapat digunakan, seperti _shared database_ dengan _shared schema_, _shared database_ dengan _isolated schema_, dan _isolated database_ dengan _shared app server_. Dengan memahami konsep ini, _developer_ dapat membuat aplikasi yang mampu melayani banyak _tenant_ dengan efisien dan efektif.