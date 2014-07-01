$(document).ready(function() {

	var ros = connectToROS();
	var subscribers = {};

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
	function makeTopic(name, type) {
		var topic = new ROSLIB.Topic({
			ros : ros,
			name : name,
			messageType : type
		});
		return topic;
	}
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
	function publishMessage(name, type) {
		var topic = makeTopic(name, type);
		var message = makeMessage(type);
		topic.publish(message);
		return undefined;
	}
	function subscribeToMessage(index, name, type) {
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
	function unsubscribe(index) {
		subscribers[index].unsubscribe();
		delete subscribers[index];
		return undefined;
	}


	// Publish button click
	$('#publish ul li').click(function() {
		var name = '/web/' + type;
		var a = $(this).attr('class');
		var b = $(this).attr('id');
		var type = a + '/' + b;
		publishMessage(name, type);
	});
	$('#subscribe ul li:first-child').click(function() {
		var index = $(this).parent().attr('id');
		var name = '/cameras/left_hand_camera/image';
		var type = 'std_msgs/String';
		subscribeToMessage(index, name, type);
	});
	$('#subscribe ul li:last-child').click(function() {
		var index = $(this).parent().attr('id');
		unsubscribe(index);
	})
});