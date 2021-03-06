$(document).ready(function() {

	/* Globals */

	var ros = connectToROS();
	var subscribers = {};


	/* Functions */

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
			case 'baxter_core_msgs/JointCommand':
				message = new ROSLIB.Message({
					mode : 1,
					command : [0.0, -0.55, 0.0, 0.75, 0.0, 1.26, 0.0],
					names : ['left_s0', 'left_s1', 'left_e0', 'left_e1', 'left_w0', 'left_w1', 'left_w2']
				});
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
	function unsubscribeFromTopic(index) {
		if(subscribers[index]) {
			subscribers[index].unsubscribe();
			delete subscribers[index];
		}
		else {
			console.log('Already unsubscribed');
		}
		return undefined;
	}
	function initializeStreamCanvas() {
		var viewer = new MJPEGCANVAS.Viewer({
			divID : 'mjpeg',
			host : 'localhost',
			width: 640,
			height : 480,
			topic : '/cameras/left_hand_camera/image'
		});
		return undefined;
	}


	/* Events */

	// Publish a message button clicked
	$('#publish ul:nth-child(2) li').click(function() {
		var a = $(this).attr('class');
		var b = $(this).attr('id');
		var type = a + '/' + b;
		var name = '/web/' + type;
		publishMessage(name, type);
	});
	$('#publish ul:nth-child(4) li').click(function() {
		var ns = '/robot/limb/left/';
		var nsType = 'joint_command';
		var name = ns + nsType;
		var type = 'baxter_core_msgs/JointCommand';
		publishMessage(name, type);
	})
	// Start subscribing to left hand camera button clicked
	$('#stream ul li:first-child').click(function() {
		if(!$('#subscribe #mjpeg canvas').length) {
			initializeStreamCanvas();
		}
		else {
			console.log("Stream has already started");
		}
	});
	// Stop subscribing to left hand camera button clicked
	$('#stream ul li:last-child').click(function() {
		if($('#stream #mjpeg canvas').length) {
			$('#stream #mjpeg canvas').remove();
		}
		else {
			console.log("Stream has already stopped.");
		}
	})
});