## Create a Mongo Atlas account

Visit https://account.mongodb.com/account/login and create an account.

Next Steps:

1. Create a shared cluster
2. Select Google Cloud Platform
3. Leave everything as default
4. Create Cluster
5. Once cluster is created, click connect. (located in your sandbox cluster)
6. Select "allow access from everywhere"
7. Enter "0.0.0.0/0" for IP Adresss and select Add IP Adress
8. Create Database user, this can be anything
9. Next Step
10. Connect your application
11. Your driver should ve Node.js and your version should be 3.6 or later
12. Copy the url
13. Go to your command line and type

    echo "export MONGODB_URI="copied_url\"`heroku config:get MONGODB_URI -a undebate-something-unique`\" >> .bashrc

14. close window
15. Go to your heroku app
16. On the uppper left hand corner select more > restart all Dynos
