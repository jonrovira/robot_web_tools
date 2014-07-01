#!/usr/bin/env python

import roslib
import rospy

import baxter_interface
from baxter_interface import CHECK_VERSION

class Camera_Handler(object):

	def __init__(self):
		# Instantiate all three cameras
		self._left_camera = baxter_interface.CameraController('left_hand_camera')
		self._right_camera = baxter_interface.CameraController('right_hand_camera')
		self._head_camera = baxter_interface.CameraController('head_camera')

	def start_camera(self):
		# Close all three cameras
		self._left_camera.close()
		self._right_camera.close()
		self._head_camera.close()

		# Open one camera
		self._left_camera.open()
		#self._left_camera.resolution = [1280, 800]
		self._left_camera.resolution = [1280, 800]

		while not rospy.is_shutdown():
			rospy.spin()
		rospy.signal_shutdown("Done")

	def clean_shutdown(self):
		# Close the open camera
		self._left_camera.close()

def main():
	# Initialize ROS node
	print "Initializing node..."
	rospy.init_node	("camera_starter")

	# verify robot is enabled
	print("Getting robot state... ")
	rs = baxter_interface.RobotEnable(CHECK_VERSION)
	init_state = rs.state().enabled
	print("Enabling robot... ")
	rs.enable()
	print("Running. Ctrl-c to quit")

	# Start
	camera_handler = Camera_Handler()
	rospy.on_shutdown(camera_handler.clean_shutdown)
	print("Starting camera...")
	camera_handler.start_camera()
	print("\nDone")
	


if __name__ == '__main__':
	main()
