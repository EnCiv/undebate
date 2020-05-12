# **Undebate**

Not debates, but recorded online video Q&A with candidates so voters can quickly can get to know them, for every candidate, for every election, across the US.

![November 5, 2019 San Francisco District Attorney Race](https://res.cloudinary.com/hf6mryjpf/image/upload/c_scale,w_360/v1573682312/2019Nov5_San_Francisco_Districe_Attorney_rtexr1.png)

See our MVP/demo of the November, 5, 2019 San Francisco District Attorney race at: https://undebate.herokuapp.com/san-francisco-district-attorney

**Copyright 2019 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# The Need for a Public Good License Condition

We believe that one of the causes of our national polarization, and the polarization around the world is application of some common for-profit business practices to democratic discourse. For example targeted marketing is the practice of identifying a subset of the market, and tailoring a message specifically for them. This is a great practice for making money, and consumers benefit by getting products that are tailored to their needs– we have toothpaste for whitening, for clean breath, for cavities, for sensitive gums, etc. However, when it comes to democratic discourse, and the information that people need in order to make the best decisions about the future of the country (or state, or city, etc.) these practices are the opposite of beneficial. Everyone needs all the same information, and there is only one government that must work for the good of all of us. EnCiv is building tools to enable very large groups of diverse people to work together very effectively, and this is just the tip of the iceberg. These tools and the resulting code are intended to be used for the public good and not to divide people. Consequently, we make this software open to individuals, and to 501(c)(3) organizations because they have formally committed to the public good over profit. We hope you will join us.

The Open Source Initiative, an organization with many for-profit sponsors, will say that this does not fit **[The Open Source Definition](https://opensource.org/osd)**. We invite you to decide for yourself if it is the kind of **open source software** you would like to see used for the public good. EnCiv is also eager to talk with for-profit organizations interested in using their tools for the public good.

# Contributions

Contributions are accepted under the MIT License without additional conditions. Use of the software, however, must abide by the MIT License with the Public Good Condition. This additional condition ensures that in the event the software is sold or licensed to others, the revenue so generated will be used to further the public mission of EnCiv, Inc, a 501(c)(3) nonprofit, rather than to enrich any directors, employees, members, or shareholders. (Nonprofits can not have shareholders)

# Getting started

You will need a github.com account, and a heroku.com account. Heroku is like a server in the cloud that you can push git repo's to, and after you push, heroku will build and run them. It's also great because they give you free accounts that you can use for development.

The install instructions are **[here](./doc/Install.md)**

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

## How to add a new web page to the server

Here is the flow. When a user visits the server with a url, `getIota()` in [server](./app/server/server.js) will look up the path in the database. If it finds a match, it will look for a webComponent and render that on the server through [app/server/routes/serverReactRender](./app/server/routes/server-react-render.jsx). All the properties of this webComponent will be passed as props to the corresponding React component.Then the page will be sent to the browser, and then rehydrated there, meaning the webComponent will run again on the browser, starting at [app/client/main.js](./app/client/main.js) and react will connect all the DOM elements.

### 1) Add a React Component to [./app/components/web-components](./app/components/web-components)\*\*

here is simple one, [./app/components/web-components/undebate-iframes.jsx](./app/components/web-components/undebate-iframes.jsx):

```
'use strict'

import React from 'react'
import injectSheet from 'react-jss'


const styles = {
  title: {
    color: 'black',
    fontSize: '2rem',
    textAlign: 'center',
  },
  frame: { marginTop: '1em', marginBottom: '1em', width: '100vw' },
}

class UndebateIframes extends React.Component {
  render() {
    const { classes } = this.props
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080

    return (
      <div>
        <div>
          <span className={classes['title']}>These are the Undebates</span>
        </div>
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race1"
          src="https://cc.enciv.org/san-francisco-district-attorney"
        />
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race2"
          src="https://cc.enciv.org/country:us/state:wi/office:city-of-onalaska-mayor/2020-4-7"
        />
      </div>
    )
  }
}
export default injectSheet(styles)(UndebateIframes)
```

### 2) Add that component to the [index.js](./components/web-components/index.js)

```
  ...
  const WebComponents = {
    TestJoin: require('./test-join'),
    ...
    UndebateIframes: require('./undebate-iframes'),
  }
  ...
```

Wish List: I wish that this file could be automatically generated based on the files in the directory. For now, we do it manually.

### 3) Create a new document in the iotas collection of the database

The example is the minimum information required. Any additional properties you add to webComponent will be passed as props to the associated React component.

```
{
    "path": "/iframe-demo",
    "subject": "Iframe demo",
    "description": "a quick prototype of a page showing multiple undebates in separate iframes",
    "webComponent": {
        "webComponent": "UndebateIframes"
    },
}
```

Note that the \_id property is not shown here. When you add this document to the database, it will automatically assign the \_id.

### 4) Add new document to iota.js

If the new document that you are creating should be included in every new installation, then you should add the document, with the \_id assigned, to [iota.json](./iota.json)

### 5) Advanced: Component

If your page should pull data out of the database, or calculate something to pass to the web component, then you can add a component to [app/components/components](./app/components/data-components), add it to the [app/components/data-components/index.js](./app/components/data-components/index.js) and then add a component: {component: YourComponentNane, ...} to the document above.

## Database

There is a tool that lets you view and edit the database in a browser window. This has been really useful in development. To get there:

1. Browse to heroku and login to your account.
2. In the list find the undebate-something-unique app that you created.
3. You should see a logo next to a link called "mLab MongoDB". Click on that link.
4. That will open a new window into your database. You will see 3 collections:
   1. iota: this is where "objects" are stored related to the debates. Different objects have different content and this is an advanage of a NoSQL database.
   2. logs: We are using log4js and the output goes to this collection, and to the console. To view the logs from the server in the cloud use `app/tools/logwatch.js db $MONGODB_URI`. To exit, Control-C
   3. users: when people save their recordings, a users record is created. There's not much here now, and we need to expand on this.
5. You can click on collections and look through them, you can edit entries (carefully!), and you can create new ones.

The server will only copy the iota.js file into the database if the databse is empty when it starts up. Another thing you can do is use mongoimport to upload the iota.js file into the database. To do that you will need to install mongo from https://docs.mongodb.com/manual/administration/install-community/ and then:

```
mongoimport --type json --collection iotas --file iota.json --uri $MONGODB_URI --jsonArray --mode
upsert
```

**Note this will overwrite documents of the same \_id.** But other documents won't be harmed.
