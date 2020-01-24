#bash
#backup the collections
if [ ! "$1" ]; then
  echo "Missing remote db uri";
  exit 1;
fi
if [ ! "$2" ]; then
  echo "Missing backup directory name";
  exit 1;
fi
mongoimport /uri:$1 /collection:users $2/users.json
mongoimport /uri:$1 /collection:iotas $2/iotas.json
# don't need to restore logs mongoexport /uri:$1 /collection:logs /out:backups/$2/logs.json
