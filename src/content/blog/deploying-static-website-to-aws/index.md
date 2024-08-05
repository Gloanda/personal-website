---
title: "Deploying Static Website to AWS"
summary: "Deploying a static website using AWS S3, Route 53, and CloudFront."
date: "Aug 01 2024"
draft: false
tags: 
- Tutorial
- AWS
---

Hey there! Thinking about setting up a static website? You've come to the right place. AWS makes it super easy to get one up and running. In this article, we’re going to walk through the whole process of deploying a static website using AWS S3, Route 53, and CloudFront.

First off, why AWS? Well, AWS got some pretty powerful tools that can make your website fast, reliable, and scalable. With S3, you can store all your website files securely. Route 53 will help you manage your domain name, making sure visitors can find your site. And CloudFront? It’s a content delivery network that will speed up your site by serving it from locations closest to your visitors.

By the end of this article, you’ll have your very own website live on AWS. We’ll cover everything from setting up your S3 bucket and configuring your domain with Route 53, to configuring CDN with CloudFront.

Ready to get started? Let’s dive in!

## Prerequisites
Before we jump into the fun stuff, let’s make sure we’ve got everything we need to get started. Here’s a quick checklist:

**1. AWS Account**  
First things first, you need an AWS account. If you don’t have one yet, head over to the [AWS](https://aws.amazon.com) website and sign up. Don’t worry, they have a free tier that’ll cover most of what we need for this project.

**2. Basic AWS Knowledge**  
You don’t need to be an AWS expert, but a little familiarity with the basics will go a long way. Knowing your way around the AWS Management Console and having a basic understanding of S3, Route 53, and CloudFront will be super helpful.

**3. Website Files**  
Have your website files ready to go. These are the HTML, CSS, JavaScript, and any other files that make up your static site. If you’re just trying things out, you can use a simple “Hello World” HTML file.

**4. Domain Name**  
If you want a custom domain for your website, you’ll need to register one. You can do this through AWS Route 53 or any other domain registrar like [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com/)

That’s it! Once you’ve got all these in place, you’re ready to start deploying your static website on AWS. Let’s get to it!

## Setting Up S3 for Static Website Hosting
First, we need to create a bucket to store our website files. Login to your AWS Management Console dashboard and navigate to the S3 service. Click the "Create bucket" button, enter a unique name for the bucket (for example, your domain name), and specify your preferred region. Keep the default settings and click “Create bucket” at the bottom.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gmt5ksgy8yq61hqqx8js.png)

After that, upload the main HTML file of your website (index.html) to the bucket. Click the name of your bucket, click the upload button, click the add files button then choose your index.html file, and lastly click upload.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lfbdlavwria76wsvqcyo.png)

**Note:** AWS S3 itself has an option to enable static website hosting directly from the bucket. In this article, we won't enable that option. Why? because it's not secure. The AWS S3 website endpoints do not support HTTPS and by enabling static website hosting, everyone can access our bucket directly. We will be using the more secure option which is using CloudFront to serve requests to our S3 bucket.

## Configuring Route 53 for Domain Management
Next, we need to manage our domain with Route 53. Navigate to the Route 53 service and click the “Create hosted zone” button. Enter your domain name in the “Domain name” field and click the “Create hosted zone” button.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bkbayjlzvevijh52q8jc.png)

Click the name of the newly created hosted zone. On the details page, you'll notice some records that have already been created for your hosted zone which are NS and SOA records. Later, we will add A record pointing to our website and CNAME record for DNS validation. (For a detailed explanation about DNS record types, you can check [here](https://www.cloudflare.com/learning/dns/dns-records/))

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8uetltllgeq24osxstqz.png)

**Note:** If your domain is registered with a provider other than Route 53 (like [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com/)), you’ll need to update your domain to use nameservers provided by Route 53. Change the nameservers on your domain management settings with the values of the NS record of Route 53 hosted zone.

## Creating an SSL certificate from AWS Certificate Manager
Next, to secure our website with SSL encryption, we need to request SSL certificate. From AWS Management Console, navigate to the Certificate Manager service, click the “Request a certificate” button, choose “Request a public certificate” and click “Next”. In the next page, enter your domain name (e.g., www.gloanda.com) and any additional names (e.g., gloanda.com) so that our site is reachable by either name. Click the "Request" button.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ckivy1s5xqou43l61c9k.png)

On the certificate detail page, you’ll see a list of CNAME records that need to be added to your DNS configuration. ACM can automatically create these records for you. Click “Create records in Route 53” and choose your hosted zone, ACM will handle the rest.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7lnea9r0tuboeml6lc0q.png)

After adding the CNAME records, it may take a few minutes for AWS to validate your domain. Once validated, you’ll see the status change to “Issued” in the ACM console.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dymi1rskeqczsq7piuz0.png)

## Setting Up CloudFront Distribution
Next, we need to set up CloudFront to make our website faster and more secure. From the AWS Management Console, navigate to the CloudFront service. Click the “Create Distribution” button. Set the origin domain to your S3 bucket. Choose "Origin access control settings (recommended)" as origin access, and select our bucket OAC as origin access control. This will make it so that our bucket can restrict access to only CloudFront. (There will be an alert telling you to update the S3 bucket policy, we will do this later)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i9ge6nm0e18qpj3h1llz.png)

Scroll down until you find the "Alternate domain name (CNAME)" field, and add your domain name. In the "Custom SSL certificate" field, select the ACM certificate that we have just created. Lastly, specify index.html as the default root object. Click the "Create distribution" button.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h5adqvzhyj439q7rn7yc.png)

Next, we will update our S3 bucket policy so that our CloudFront distribution can access it. Copy the code for the bucket policy below (don't forget to change the source ARN with your CloudFront ARN)

```json
{
        "Version": "2008-10-17",
        "Id": "PolicyForCloudFrontPrivateContent",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::gloanda.com/*",
                "Condition": {
                    "StringEquals": {
                      "AWS:SourceArn": "YOUR_CLOUDFRONT_ARN"
                    }
                }
            }
        ]
}
```
Navigate to the S3 service page, and click your bucket name. In the bucket details page, change to the "Permissions" tab, click edit on bucket policy, paste the policy you have just copied, and click save changes.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x56g9ut4wmzn3pjek38m.png)

Just a little bit more until we have our website deployed! Back on the CloudFront distribution details page, try opening the distribution domain name in your browser. You should see your website now.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9ujx4963puq73f8e6cj9.png)

Lastly, to make our website accessible through our domain name, we need to add an alias record in the Route 53 hosted zone. Click "Create record" on the details page. Enable alias, choose our CloudFront distribution as endpoint, and click "Create records".

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4gue2ezw0uuolbm0pnhw.png)

Wait until the change status is changed to "INSYNC" which means our website is accessible through our domain. Now, you should see your website when opening your domain in browser. Awesome!

## Conclusion
Congratulations! You've successfully deployed a static website on AWS using S3, Route 53, and CloudFront. By setting up an S3 bucket for hosting, configuring Route 53 for domain management, and leveraging CloudFront for fast and secure content delivery, your website is now scalable, secure, and performant. This setup not only ensures quick load times and robust security with SSL/TLS encryption but also takes advantage of AWS's cost-effective and reliable infrastructure.

Thanks for following along! I hope this guide helped you get your static website up and running on AWS. If you have any questions or run into any issues, feel free to reach out or leave a comment below. Happy hosting!