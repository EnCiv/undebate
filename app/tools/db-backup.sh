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
mongoexport /uri:$1 /collection:users /out:backups/$2/users.json
mongoexport /uri:$1 /collection:iotas /out:backups/$2/iotas.json
mongoexport /uri:$1 /collection:logs /out:backups/$2/logs.json
