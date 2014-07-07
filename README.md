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