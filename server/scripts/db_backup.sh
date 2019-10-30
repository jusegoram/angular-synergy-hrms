DIR=`date +%m%d%y`
DEST=/home/rccbpo/db_backups/$DIR
mkdir $DEST
mongodump -d mongo-blink -o $DEST