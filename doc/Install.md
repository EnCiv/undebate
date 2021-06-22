# Install

This application is build on the EnCiv/civil-server. The civil-server is intended for building web sites in a modular fashion, where each "module" is built and tested separately, using the the civil-server as a component, that happens to be the server. Then, for integration, all the modules can be pulled together into one repo where the civil server is the server component..

First, follow the [Getting Started](https://github.com/EnCiv/civil-server-template#getting-started) instructions for the [civil-server-template](https://github.com/EnCiv/civil-server-template) but when you got to the

```
git clone https://github.com/EnCiv/civil-server-template my-app
```

instead do:

```
git clone https://github.com/EnCiv/undebate undebate
```

Now we will add Cloudinary - a Content Delivery Network that has image and video manipulation features. A CDN gives you a place to store these things, and deliver them quickly over the internet. Your node server would be slower, and doesn't keep the files after the server restarts. In the text that follows, replace [something unique] with some name that you come up with, including the []'s for example undebate-banana

    heroku addons:create cloudinary:starter -a undebate-[something unique]

Again we get the environment variable with the URL for Cloudinary and store it in your config file for local use. There's a password in the string, so keep it secret.

    echo "export CLOUDINARY_URL="\"`heroku config:get CLOUDINARY_URL -a undebate-[something unique]`\" >> .bashrc

Then to get all these environment variables set in your current instance of bash do this. But you won't have to it the next time you start up.

    source .bashrc

Now you should be able to run it.

    npm run dev

You should now be able to browser to localhost:3011/candidate-conversation and see an undebate. The server is running locally on our machine. It's using webpack, which is really neat bacuase when you save changes to the source code, it will automatically be compliled and applied to the server and to the application in your browser. You may still have to refresh your browser page though.

You can use Control-C to terminate the server

To run this in the cloud on heroku:

    git push heroku HEAD:master

Then you will be able to browse to `https://undebate-[something unique].herokuapp.com/candidate-conversation` and see the same thing.

Then, to record your own part in the candidate conversation browser to: localhost:3011/candidateboard-conversation-candidate-recorder or `https://undebate-something-unique.herokuapp.com/schoolboard-conversation-candidate-recorder`

There are other urls that you can check out in your development environment. To see the latest list do this:

```
cat iota.json | grep path
```

Here is the list as of the time of this writing:

```
    "path": "/candidate-conversation-5",
    "path": "/candidate-conversation",
    "path": "/candidate-conversation-candidate-recorder",
    "path": "/candidate-conversation-candidate-recorder-sendinblue",
    "path": "/candidate-conversation-candidate-recorder-with-email",
    "path": "/what-is-democracy",
    "path": "/youtube",
    "path": "/hackforla-projects",
    "path": "/hackforla-projects-recorder",
    "path": "/schoolboard-undebate",
    "path": "/schoolboard-undebate-candidate-recorder",
    "path": "/candidate-conversation-2",
    "path": "/candidate-conversation-3",
    "path": "/candidate-conversation-4",
    "path": "/candidate-conversation-6",
    "path": "/candidate-conversation-7",
    "path": "/test-join",
    "path": "/iframe-demo",
    "path": "/unpoll-demo"
```

Just take the url part, like "what-is-democracy" and add either localhost:3011 or https://undebate-[something unique].herokuapp.com at the beginning and you will be able to check it out.

# Prettier

This project is now using prettier. This makes some spacing and the user of quotes and a few other things consistent across the project.

## To get prettier in Visual Studio Code

1. Open VSC for this project
2. Hit Control-P
3. In the search box paste in this text: `ext install esbenp.prettier-vscode`
4. Go to [File][preferences][Settings] where you will see a search box followed by a list of settings.
5. Search for `editor format on save`
6. Click on `workspace` just below the search bar - so that this setting only applies to this work space
7. Check the box for `Editor: Format On Save`

If you are not using VSC prettier will also be run before you commit, but see if prettier is available for your editor and post instuctions here

## EMAIL Setup

Setting up email from the server is not required, and is kind of hard. For information on how to do it for g-suite see https://medium.com/@imre_7961/nodemailer-with-g-suite-oauth2-4c86049f778a
If you do, edit the .bashrc file and add these lines

    export NODEMAILER_SERVICE="gmail"
    NODEMAILER_USER="no-reply@yourdomain.com"
    NODEMAILER_SERVICE_CLIENT="XXXXXXXXXXXXXXXXXXXXX"
    NODEMAILER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX........XXXXX\n-----END PRIVATE KEY-----\n

If you use Zoho, you can do it like this.

    export NODEMAILER_SERVICE="Zoho"
    NODEMAILER_USER="no-reply@yourdomain.com"
    NODEMAILER_PASS="xxxxxxxxx"

After you make changes to the .bashrc file you will need to heroku config:set them to get them to heroku
