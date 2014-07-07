### Get everything up and running
1. Make sure "Enable Networking" is unchecked in the networking menu
2. Ensure that Baxter ethernet cable is connected to PC
3. Open up a terminal and run Avahi's network address configuration daemon
	```
	$ sudo avahi-autoipd eth0
	```
4. In a new terminal, start roscore
```
$ roscore
```
5. In a new terminal, launch a rosbridge server
	```
	$ roslaunch rosbridge_server rosbridge_websocket.launch
	```
6. In a new terminal, launch a mjpeg server
	```
	$ rosrun mjpegserver mjpeg_server
	```
7. In Google Chrome, navigate to the local html page
	```
	$ file:///home/puppeteer/jons_stuff/catkin_ws/src/robot_web_tools/src/index.html
	```
8. To see Baxter's left hand camera stream, run the startcamera script in a new terminal
	```
	$ rosrun robot_web_tools startcamera.py
	```