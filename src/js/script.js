$(document).ready(function() {

	/*
	 * Globals
	 */

	var ros = connectToROS();
	var subscribers = {};


	/*
	 * Functions
	 */

	// Connects to ROS using rosbridge server
	function connectToROS() {
		ros = new ROSLIB.Ros({
			url : 'ws://localhost:9090'
		});
		ros.on('connection', function() {
			console.log('Connected to websocket server.');
		});
		ros.on('error', function(error) {
			console.log('Error connecting to websocket server: ', error);
		});
		ros.on('close', function() {
			console.log('Connection to websocket server closed.');
		});
		return ros;
	}
	// Make a topic
	function makeTopic(name, type) {
		var topic = new ROSLIB.Topic({
			ros : ros,
			name : name,
			messageType : type
		});
		return topic;
	}
	// Make a message
	function makeMessage(type) {
		var message;
		switch(type) {
			case 'std_msgs/String':
				message = new ROSLIB.Message({
					data : "Hello, world!"
				});
				break;
			case 'std_msgs/Time':
				message = new ROSLIB.Message({
					data : {
						secs: 10,
						nsecs: 1234
					}
				});
				break;
			case 'std_msgs/Bool':
				message = new ROSLIB.Message({
					data : true
				});
				break;
		}
		return message;
	}
	// Publish a message
	function publishMessage(name, type) {
		var topic = makeTopic(name, type);
		var message = makeMessage(type);
		topic.publish(message);
		return undefined;
	}
	// Subscribe to a topic
	function subscribeToTopic(index, name, type) {
		if(!subscribers[index]) {
			var listener = makeTopic(name, type);
			subscribers[index] = listener;;
			listener.subscribe(function(message) {
				console.log('Received message on '+ listener.name + ': ' + message.data);
			});
		}
		else {
			console.log('Already subscribing to topic');
		}
		return undefined;
	}
	// Unsubscribe from a topic
	function unsubscribe(index) {
		subscribers[index].unsubscribe();
		delete subscribers[index];
		return undefined;
	}


	/*
	 * Events
	 */

	// Publish a message button clicked
	$('#publish ul li').click(function() {
		var name = '/web/' + type;
		var a = $(this).attr('class');
		var b = $(this).attr('id');
		var type = a + '/' + b;
		publishMessage(name, type);
	});
	// Start subscribing to left hand camera button clicked
	$('#subscribe ul li:first-child').click(function() {
		var index = $(this).parent().attr('id');
		var name = '/cameras/left_hand_camera/image';
		var type = 'std_msgs/String';
		subscribeToTopic(index, name, type);
	});
	// Stop subscribing to left hand camera button clicked
	$('#subscribe ul li:last-child').click(function() {
		var index = $(this).parent().attr('id');
		unsubscribe(index);
	})
});