#!/usr/bin/env python

import roslib
import rospy

import baxter_interface

class Camera_Handler(object):

	def __init__(self):
		# Instantiate all three cameras
		self._left_camera = baxter_interface.CameraController('left_hand_camera')
		self._right_camera = baxter_interface.CameraController('right_hand_camera')
		self._head_camera = baxter_interface.CameraController('head_camera')

		# Start camera
		self.start_camera()

	def start_camera(self):
		# Close all three cameras
		self._left_camera.close()
		self._right_camera.close()
		self._head_camera.close()

		# Open one camera
		self._left_camera.open()
		self._left_camera.resolution = [1280, 800]

	def close_camera(self):
		# Close the open camera
		self._left_camera.close()

def main():
	# Initialize ROS node
	rospy.init_node('camera_starter')

	# Open camera
	camera_handler = Camera_Handler()
	
	# Spin
	# To quit, press a button on the keyboard
	try:
		rospy.spin()
	except KeyboardInterrupt:
		print "Closing camera..."
		# Close open camera
		camera_handler.close_camera()


if __name__ == '__main__':
	main()
