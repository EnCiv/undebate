#!/bin/bash

echo '*************************************************************************'
echo POSTINSTALL
echo '*************************************************************************'

echo '*************************************************************************'
echo Symbolick link
echo '*************************************************************************'

mkdir -p node_modules/syn
# on windows environment make sure /tmp exisits so that stream uploads of pictures will work
mkdir -p /tmp
mkdir -p assets/js
cp node_modules/socket.io-stream/socket.io-stream.js assets/js/

echo '***'
echo Svgr
echo '***'
npm run svgr

echo '*************************************************************************'
echo TRANSPILE
echo '*************************************************************************'

npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"

echo '*************************************************************************'
echo WEBPACK
echo '*************************************************************************'

npm run packbuild  || {
  echo Could not webpack;
  exit 1
}
echo "webpack ok"


