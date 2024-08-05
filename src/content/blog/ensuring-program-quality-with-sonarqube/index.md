---
title: "Ensuring your Program Quality with SonarQube"
summary: "How to use SonarQube to improve your code quality."
date: "May 3 2023"
draft: false
tags: 
- PPL
- SonarQube
---

Selama proses pengembangan aplikasi pada proyek PPL, kami diharapkan untuk mampu menghasilkan program dengan kualitas yang baik. Memastikan _code_ tidak mengandung _code smell_, memastikan _test case_ meng-_cover_ seluruh _behavior_ program, memastikan tidak terdapat _security issue_ pada program, dan sebagainya menjadi hal yang wajib saat pengembangan aplikasi pada proyek PPL.

Namun, hal tersebut semakin sulit dilakukan seiring dengan bertambah besar dan kompleks aplikasi yang dikembangkan. Oleh karena itu, diperlukan tools pendukung yang dapat membantu kita dalam memastikan kualitas program. Beberapa contoh dari tools tersebut meliputi SonarQube, SonarLint, CodeClimate, dan sebagainya. Pada artikel ini, akan dibahas penerapan SonarQube pada proyek PPL yang saya kerjakan.

**SonarQube**

SonarQube adalah sebuah platform analisis _code_ yang digunakan untuk meningkatkan kualitas _software_. Dengan SonarQube, kita dapat menganalisis code yang kita buat dan mendapatkan _feedback_ terkait kualitas dari code yang telah dibuat. SonarQube berisi berbagai fitur yang dapat membantu meningkatkan kualitas kode. Fitur-fitur tersebut meliputi analisis _code smell_, _duplicated code_, _code coverage_, dan _security hotspot_.

**Code Smell**

Code smell merupakan salah satu faktor penentu kualitas _code_. Beberapa contoh code smell meliputi _duplicated string,_ penggunaan _print_ pada _code production,_ nama _function_ yang tidak sesuai konvensi, dan masih banyak lagi. Hal tersebut akan sangat sulit rasanya untuk dianalisis secara manual. SonarQube dapat melakukan analisis pada _code_ dan menentukan apakah _code_ masih mengandung _code smell_ ([Kriteria code smell SonarQube](https://rules.sonarsource.com/python/type/Code%20Smell)). Sebagai contoh, perhatikan code dari proyek PPL yang sedang saya kerjakan

```python
@route.get('/list', response=List[LoanProductSchema], auth=JWTAuth())
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
        if product_id:
            query &= Q(id__icontains=product_id)
        if product_name:
            query &= Q(category__icontains=category)
        try:
            if create_date_start:
                create_date_start = datetime.strptime(create_date_start, '%d-%m-%Y')
                query &= Q(create_date__gte=create_date_start)
            if create_date_end:
                create_date_end = datetime.strptime(create_date_end, '%d-%m-%Y') + timedelta(days=1)
                query &= Q(create_date__lte=create_date_end)
            if update_date_start:
                update_date_start = datetime.strptime(update_date_start, '%d-%m-%Y')
                query &= Q(update_date__gte=update_date_start)
            if update_date_end:
                update_date_end = datetime.strptime(update_date_end, '%d-%m-%Y') + timedelta(days=1)
                query &= Q(update_date__lte=update_date_end)
        except ValueError:
            raise HttpError(400, "Invalid date format. Use DD-MM-YYYY.")

        loan_products = LoanProduct.objects.filter(query)
        return loan_products
```

_Code_ diatas merupakah implementasi dari salah satu _endpoint_ API pada proyek PPL saya. Sekilas tidak terdapat masalah pada code tersebut. Saya sendiri tidak menyadari adanya code smell sampai dilakukan analisis dengan SonarQube yang ternyata menemukan _code smell_.

![Analisis pada SonarQube menunjukan code smell pada code](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*QFQWdWVQNo2ceygK0Jk8Gg.png)

Selain menemukan _code smell_, SonarQube juga dapat memberikan detail bagian _code_ yang meghasilkan _code smell_ dan juga memberikan penjelasan terhadap _code smell_ dan contoh cara menghilangkan _code smell_ tersebut

![Detail dan penjelasan _code smell_](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*cQmUeTF0YBWUgEa9YRVPRg.png)

Berdasarkan analisis tersebut terdapat _duplicated string_ pada _code_, sehingga salah satu cara yang dapat dilakukan untuk menghindari _code smell_ tersebut adalah dengan membuat _variable_ yang merepresentasikan _duplicated string_ tersebut.

```python
@route.get('/list', response=List[LoanProductSchema], auth=JWTAuth())
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
        dateformat = '%d-%m-%Y'
        if product_id:
            query &= Q(id__icontains=product_id)
        if product_name:
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
            raise HttpError(400, "Invalid date format. Use DD-MM-YYYY.")

        loan_products = LoanProduct.objects.filter(query)
        return loan_products
```

**Duplicated Code**

_Duplicated code_ juga merupakan faktor penentu kualitas program. Program yang memiliki banyak _duplicated code_ cenderung memiliki _maintanibility_ yang lebih buruk. SonarQube dapat mendeteksi _duplicated code_ yang terdapat pada program kita. Sebagai contoh, perhatikan 2 contoh potongan _code_ dari proyek PPL saya

```python
@route.get('/list', response=List[LoanProductSchema], auth=JWTAuth())
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

```python
@route.get('/list', response=List[SectionSchema], auth=JWTAuth())
    @paginate()
    def get_section_list(
            self,
            section_id: str = None,
            section_name: str = None,
            section_minimum_score: int = None,
            create_date_start: str = None,
            create_date_end: str = None,
            update_date_start: str = None,
            update_date_end: str = None
    ):
        query = Q()
        dateformat = '%Y-%m-%d'
        if section_id:
            query &= Q(id__icontains=section_id)
        if section_name:
            query &= Q(name__icontains=section_name)
        if section_minimum_score:
            query &= Q(minimum_score=section_minimum_score)
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

        sections = Section.objects.filter(query).annotate(
            created_date=Cast(TruncMinute("create_date"), CharField()),
            updated_date=Cast(TruncMinute("update_date"), CharField()),
            question_count=Count('question')
        )

        return list(sections)
```

Kedua _function_ tersebut merepresentasikan endpoint API untuk mendapatkan dan melakukan _filter_ pada _loan product_ dan _section_. Bagian _filter_ berdasarkan tanggal dari kedua _function_ tersebut sama persis (_duplicated code_). Hal tersebut dapat terdeteksi oleh SonarQube lengkap dengan menunjukan persentase _duplicated code_ pada program serta bagian yang mengandung _duplicated code._

![Persentase duplicated code hasil deteksi SonarQube](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*ODGcRF3n0c-E-7JpZuX2xw.png)

![Detail bagian code yang mengandung duplicated code](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*iRfPv24HP8lvKK5J363B0Q.png)

Hal yang saya lakukan untuk mengatasi _duplicated code_ tersebut adalah dengan melakukan _extract_ bagian _filter_ sebagai _function_ seperti berikut

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
```

```python
@route.get('/list', response=List[LoanProductSchema], auth=JWTAuth())
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

```python
@route.get('/list', response=List[SectionSchema], auth=JWTAuth())
    @paginate()
    def get_section_list(
            self,
            section_id: str = None,
            section_name: str = None,
            section_minimum_score: int = None,
            create_date_start: str = None,
            create_date_end: str = None,
            update_date_start: str = None,
            update_date_end: str = None
    ):
        query = Q()
        dateformat = '%Y-%m-%d'

        sections = get_filtered_objects(Section, query, dateformat, id=section_id, name=section_name,
                                        minimum_score=section_minimum_score, create_date_start=create_date_start,
                                        create_date_end=create_date_end, update_date_start=update_date_start,
                                        update_date_end=update_date_end)

        sections = sections.annotate(
            question_count=Count('question')
        )

        return list(sections)
```

**Code Coverage**

_Code coverage_ menunjukan seberapa banyak bagian _code_ yang ter-_cover_ oleh _unit test_. Semakin tinggi _code coverage_, maka semakin banyak _behavior_ program yang di-_test_. SonarQube juga dapat melakukan analisis _code coverage_ dengan menunjukan persentase _code coverage_ baik untuk program keseluruhan ataupun untuk setiap _file._

![Persentase code coverage untuk program keseluruhan](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*MJpGNGE33gXoAEwm3nHxPA.png)

![Persentase code coverage untuk setiap file](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*Rm-NAmS6ei9VGTQunitG2g.png)

**Security Hotspot**

_Security hotspot_ menunjukan bagian _code_ yang berpotensi mengandung masalah _security_. SonarQube dapat menganalisis hal ini dan menunjukan secara detail letak permasalahannya. Sebagai contoh, hasil analisis SonarQube menunjukan terdapat masalah _security_ pada _code_ proyek PPL saya, tepatnya pada bagian CORS _allowed origin_ yang mengizinkan _request_ dari semua sumber (tenang saja, hal tersebut sudah di-_fix_ pada _code production_ :D)

![Hasil analisis SonarQube menunjukan security hotspot pada bagian CORS policy](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*P-l23oQtoQ4LhD8OXLGG7Q.png)

**SonarLint**

SonarLint merupakan tool lain yang dapat membantu kita menganalisis kualitas program. Tidak seperti SonarQube yang menjalankan analisis pada server, SonarLint berjalan secara lokal dan biasanya terintegrasi dengan IDE seperti Visual Studio Code, PyCharm, Intellij IDEA. SonarLint dapat membantu kita menemukan code smell secara realtime saat sedang men-develop program.

![Analisis code smell secara realtime menggunakan SonarLint](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*hX39WguO7nRuAXpiXeVvTA.png)

**Kesimpulan**

SonarQube merupakan salah satu tools analisis kualitas code. Dengan menggunakan tools tersebut, beban developer yang sebelumnya harus melakukan analisis secara manual dapat berkurang. SonarQube dapat menganalisis berbagai hal seperti _code smell_, _duplicated code_, _code coverage_, dan _security hotspot_.

**Referensi**

[SonarQube 10.0](https://docs.sonarqube.org/latest/)