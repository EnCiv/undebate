#Purpose

The purpose of this installation guide is to help you set up your google speech to text credentials. Enabling this will allow you to get transcriptions from your new recordings.

#Setup

1. Create a gcloud account (https://console.cloud.google.com/). If you have so already skip this step.
2. On the upper left hand corner click the navigation menu(aka hamburger-menu), select billing. Select payment method and enter your credit card information. You need to do this step in order to use the free tier speech to text api.
3. Hambuger-menu > Api's & services > Dashboard
4. Under the search bar select "+ Enable Api's and services"
5. Search for "Cloud Speech-to-Text API"
6. Enable the Api
7. It should take you to the api dashboard. On the left select credentials
8. click "+ create credentials" > Select service account
9. You can name the service account whatever you like . After that click create
10. Click the email of your newly created service account
11. Scroll to the bottom and click add key > create new key > json.
12. After creation, your browser should have downloaded that key as a json file.
13. Open the json file in a text editor.

#On the command line
Now we are going to get some credntials from our json file and pass them onto our local and heroku enviroment. You are going to replace the {variable} with the value that is assigned to that variable in your json file.

    echo "export TRANSCRIPTION_CLIENT_EMAIL={client_email}" >> .bashrc
    heroku config:set TRANSCRIPTION_CLIENT_EMAIL={client_email}

    echo "export TRANSCRIPTION_PRIVATE_KEY={private_key}" >> .bashrc
    heroku config:set TRANSCRIPTION_PRIVATE_KEY={private_key}

    echo "export TRANSCRIPTION_PROJECT_ID={project_id}" >> .bashrc
    heroku config:set TRANSCRIPTION_PROJECT_ID={project_id}
