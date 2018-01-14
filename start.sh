#!bin/bash
cd ..;
cd mongod;
gnome-terminal -e "sudo mongod -dbpath .";
cd ..;
cd DroneSym/;
cd dronesym-node/;
gnome-terminal -e "sudo npm start";
cd ..;
cd dronesym-frontend/;
gnome-terminal -e "sudo npm start";
cd ..;
cd dronesym-python/flask-api/src/;
gnome-terminal -e "sudo python3 main.py";
cd ..;
cd ..;
cd ..;
echo "DroneSym Running";
