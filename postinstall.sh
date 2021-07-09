#!/bin/bash

echo '*************************************************************************'
echo POSTINSTALL
echo '*************************************************************************'

#echo '*************************************************************************'
#echo These directoies need to exist in dist, even if you don't have them in your project
#echo '*************************************************************************'

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
cp -r node_modules/civil-server/assets/images ./assets/images

#
# Update/create web-components/index.js to require all react components in that director, and in the listed child/peer directories. Web components are used by the getIota route - which uses reactServerRender
#
node node_modules/civil-server/dist/tools/react-directory-indexer.js app/web-components/ node_modules/civil-server/dist/web-components/
#
# Update/create data-components/index.js to require all data-components in that director, and in the listed child/peer directories. Data components are used by the getIota route.
#
node node_modules/civil-server/dist/tools/react-directory-indexer.js --data app/data-components/ node_modules/civil-server/dist/data-components/

#echo '*************************************************************************'
#echo Svgr - create React components out of the svg files
#echo '*************************************************************************'
npm run svgr || {
  echo Could not svgr
  exit 1
}
echo "svgr ok"


#echo '*************************************************************************'
#echo TRANSPILE
#echo '*************#************************************************************'
#
npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"


#echo '*************************************************************************'
#echo WEBPACK
#echo '*************************************************************************'

npm run packbuild  || {
  echo Could not webpack;
  exit 1
}
echo "webpack ok"


