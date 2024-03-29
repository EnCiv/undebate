#!/bin/bash

#*************************************************************************'
# These directoies need to exist in dist, even if you don't have them in your project
# *************************************************************************'

mkdir -p dist/events
mkdir -p dist/routes
mkdir -p dist/socket-apis
mkdir -p dist/data-components
mkdir -p dist/web-components
#
# assets is where static files go
#
mkdir -p ./assets/js/
# you can start with the favicon images from civil-server - but you should to replace them with your own some day
mkdir -p ./assets/images
cp -rp node_modules/civil-server/assets/images ./assets/images

#
# Update/create web-components/index.js to require all react components in that director, and in the listed child/peer directories. Web components are used by the getIota route - which uses reactServerRender
#
react-directory-indexer app/web-components/ node_modules/civil-server/dist/web-components/ || {
  echo Could not build web-components
  exit 1
}
#
# Update/create data-components/index.js to require all data-components in that director, and in the listed child/peer directories. Data components are used by the getIota route.
#
react-directory-indexer --data app/data-components/ node_modules/civil-server/dist/data-components/ || {
  echo Could not build data-components
  exit 1
}

npm run svgr || {
  echo Could not svgr
  exit 1
}

npm run transpile  || {
  echo Could not transpile;
  exit 1
}

# don't run webpack if this is a dependency of another project - the memory usage will blow out heroku build 
if test \"$NPM_PROJECT\" = \"\" || test \"$NPM_PROJECT\" == \"undebate\" ; then {
  npm run packbuild  || {
    echo Could not webpack;
    exit 1
  }
}; fi


