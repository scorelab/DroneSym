#!/bin/bash
mongo --eval "db.stats()"

RESULT=$?   # returns 0 if mongo eval succeeds

if [ $RESULT -ne 0 ]; then
    echo "mongodb not running /n please run mongodb first!"
    exit 1
else
    ((cd ../dronesym-node/ && npm start & python3 ../dronesym-python/flask-api/src/main.py)&);(sleep 5 && cd ../dronesym-frontend/ && ng serve )&
fi
