---
title: "Mocking Django Model and Django FileSystemStorage"
summary: "How to mock Django model and FileSystemStorage."
date: "Apr 24 2023"
draft: false
tags: 
- PPL
- Django
---

Sebagai _software developer_, tentunya kita sudah tak asing lagi dengan proses _testing_ pada aplikasi. Tapi apakah _test_ yang kita buat telah memenuhi _best practice_? Pada artikel ini, akan dibahas penerapan _mocking_ untuk mendukung proses _testing._

**Mocking Django Model**

> a clean unit test should have five properties: Fast, Independent, Repeatable, Self-Validating, and, Timely.
> 
> _Clean Code, A Handbook of Agile Software Craftsmanship_ by Robert C. Martin (Uncle Bob)

Ketika kita membuat _unit test,_ tidak jarang kita melakukan suatu hal yang bersifat kontra-produktif terhadap properti-properti suatu _clean unit test_. Sebagai contoh, berikut adalah potongan kode dari proyek PPL yang sedang saya kerjakan.

```python
class Applicant(models.Model):
    fullname = models.CharField(max_length=100)
    application_status = models.CharField(max_length=100)
    birth_place = models.CharField(max_length=100)

class ApplicantFile(models.Model):
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    file = models.FileField(upload_to=generate_path)

    def __str__(self):
    return f"{self.applicant.fullname} - {self.file.name}"
```

Jika kita ingin melakukan test terhadap __str__ method pada model ApplicantFile, maka kita dapat melakukan testing seperti berikut

``` python
def test_applicantfile_str_method(self):
    applicant = Applicant.objects.create(
        fullname = "John Doe",
        application_status = "Pending",
        birth_place = "Jakarta"
    )
    file = SimpleUploadedFile("file.txt", b"file_content")
    applicantfile = ApplicantFile.objects.create(
        applicant = applicant,
        file = file
    )
    self.assertEqual(str(applicantfile), f"{applicant.fullname} - {file.name}")
```

Dapatkah anda menunjukkan kekurangan dari _unit test_ diatas? **_Unit test_ untuk model ApplicantFile menjadi _dependent_ terhadap model Applicant**. Sehingga, jika terdapat kegagalan pada model Applicant, maka _unit test_ untuk model ApplicantFile juga akan ikut gagal.

Selain itu, untuk menjalankan _unit test_ diatas, **kita harus membuat 2 _object_ dan memasukkannya ke _database_**. Hal tersebut dapat memperlambat proses _testing_, terutama jika _object_ yang dibuat bersifat kompleks.

Kita dapat mengatasi masalah tersebut dengan menerapkan _mocking_. Dengan _mocking_, kita dapat mensimulasikan _object_ lain tanpa harus membuat _object_ tersebut. Berikut adalah penerapan _mocking_ pada kode _unit test_ sebelumnnya

```python
def test_applicantfile_str_method(self):
    applicant = mock.Mock(spec=Applicant)
    applicant._state = mock.Mock()
    applicant.name = "John Doe"
    file = SimpleUploadedFile("file.txt", b"file_content")
    applicantfile = ApplicantFile.objects.create(
        applicant = applicant,
        file = file
    )
    self.assertEqual(str(applicantfile), f"{applicant.fullname} - {file.name}")
```

Seperti yang terlihat pada kode diatas, kita melakukan _mocking_ terhadap _object_ Applicant, memberikan _object mock_ tersebut properti yang dibutuhkan, dan menggunakan _object mock_ tersebut dalam pembuatan _object_ ApplicantFile. Dengan _mocking_, kita telah menyelesaikan masalah pada _unit test_ kita sebelumnnya dengan cara:

*   Melakukan _test_ menggunakan _object mock_ dari model Applicant (tanpa membuat _object A_pplicant model Django) sehingga proses testing tidak perlu untuk menambahkan _object A_pplicant ke _database_
*   _Unit test_ menjadi independen terhadap implementasi dari model Applicant, sehingga _unit test_ kita akan selalu berjalan tanpa tergantung terhadap model Applicant

[https://dareenzo.github.io/blog/2018/10/24/test-doubles-a-primer/](https://dareenzo.github.io/blog/2018/10/24/test-doubles-a-primer/)

**Mocking Django FileSystemStorage**

Suatu _unit test_ hendaknya dapat berjalan dengan baik tanpa dipengaruhi hal-hal eksternal seperti API _service call_ atau _environment_ aplikasi. Namun, bagaimana jika kita ingin melakukan _testing_ terhadap _behavior_ aplikasi yang berkaitan dengan hal-hal tersebut? Sebagai contoh, berikut adalah potongan kode dari proyek PPL yang sedang saya kerjakan

```python
@route.post('{applicant_id}/file', response={200: Message})
def upload_applicant_file(self, request, applicant_id: int, files: List[UploadedFile] = File(...)):
    applicant = get_object_or_404(Applicant, id=applicant_id)
    for file in files:
        ApplicantFile.objects.create(applicant=applicant, file=file)
    applicant.update_date = timezone.now()
    applicant.update_by = request.user
    applicant.save()
    return {"message": "Files successfully uploaded"}
```

Kode diatas merupakan implementasi dari salah satu API _endpoint_ pada proyek saya yang berfungsi meng-_handle upload file_ suatu Applicant dan menyimpanya ke _storage_/_database_. Jika kita ingin melakukan testing terhadap _function_ tersebut, kita dapat mengimplementasikannya sebagai berikut

```python
def test_upload_applicant_file(self):
    applicant = Applicant.objects.create(
        fullname = "John Doe",
        application_status = "Pending",
        birth_place = "Jakarta"
    )
    file = SimpleUploadedFile("file.txt", b"file_content")
    response = self.client.post(f"/api/applicant/{applicant.id}/file", data={'files': [file]})
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), {"message": "Files successfully uploaded"})
    self.assertTrue(ApplicantFile.objects.filter(applicant=self.applicant).exists())
```

Ketika _test_ tersebut dijalankan, Django akan membuat _file_ baru pada direktori yang telah ditentukan (pada kasus ini media/applicant\_files\_1/file.txt). _File_ tersebut akan tetap ada walaupun setelah _testing_ berakhir kecuali dilakukan penghapusan file secara khusus setiap _testing_ diselesaikan. Hal ini berpotensi menyebabkan masalah. Dengan menggunakan _mocking_, kita dapat mengatasi hal tersebut

```python
@patch.object(default_storage, 'save', MagicMock(return_value='applicant_files/1/file.txt'))
def test_upload_applicant_file(self):
    applicant = Applicant.objects.create(
        fullname = "John Doe",
        application_status = "Pending",
        birth_place = "Jakarta"
    )
    file = SimpleUploadedFile("file.txt", b"file_content")
    response = self.client.post(f"/api/applicant/{applicant.id}/file", data={'files': [file]})
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.json(), {"message": "Files successfully uploaded"})
    self.assertTrue(ApplicantFile.objects.filter(applicant=applicant).exists())
```

Pada kode diatas, kita melakukan _mocking_ terhadap _class default storage_ Django yaitu FileSystemStorage tepatnya pada _save method_ dari _class_ tersebut. _Mocking_ dilakukan pada _save method_ sehingga ketika _method_ tersebut dipanggil (pada pembuatan _object_), _file_ tidak akan tersimpan ke dalam _file system_. Hal tersebut bertujuan untuk membuat _file system_ tetap bersih setelah dilakukan _testing_ dan mempercepat _testing_.

**Kesimpulan**

_Mocking_ dapat membantu kita dalam membuat _unit test_ yang sesuai dengan kaidah _clean unit test_. Selain itu, _mocking_ juga dapat dilakukan terhadap hal-hal eksternal seperti pemanggilan API _service_ dan _file system_.
