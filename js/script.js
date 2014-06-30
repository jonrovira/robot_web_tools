$(document).ready(function() {

	var ros = connectToROS();

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
	function makeTopic(pkg, type) {
		var topic = new ROSLIB.Topic({
			ros : ros,
			name : '/web_'+type,
			messageType : pkg+'/'+type
		});
		return topic;
	}
	function makeMessage(pkg, type) {
		var m = pkg+'/'+type;
		var message;
		switch(m) {
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
	function publishMessage(pkg, type) {
		topic = makeTopic(pkg, type);
		message = makeMessage(pkg, type);
		topic.publish(message);
	}


	// Publish button click
	$('#publish ul li').click(function() {
		var pkg = $(this).attr('class'); 
		var type = $(this).attr('id');
		publishMessage(pkg, type);
	});
});