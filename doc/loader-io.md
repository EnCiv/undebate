#Purpose

How to setup loader.io on heroku for load testing

#Setup

1. create an app on heroku to use for load testing
2. add the loader.io add-on
3. in the heroku console, click on the loader.io icon to get to it's admin console
4. loader.io will tell you that you need to validate your app get the token string they give you and make an env variable like this:

```
echo "export LOADERIO_TOKEN=loaderio-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" >> .bashrc
```

also add this env variable to the heroku setting for the app

```
heroku config:set LOADERIO_TOKEN="loaderio-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

allow the server to restart
and then go through the validation steps with loader.io
