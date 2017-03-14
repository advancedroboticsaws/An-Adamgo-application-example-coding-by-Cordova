//Change the ip to ROS_IP
//      var rbServer = new ROSLIB.Ros({url :'ws://localhost:9090'});
        var rbServer = new ROSLIB.Ros({url :'ws://192.168.30.95:9090'});
        
// This function is called upon the rosbridge connection event
        rbServer.on('connection', function() {
            // Write appropriate message to #feedback div when successfully connected to rosbridge
            var fbDiv = document.getElementById('feedback');
            fbDiv.innerHTML += "<p>Connected to websocket server.</p>";
        });
        
// This function is called when there is an error attempting to connect to rosbridge
        rbServer.on('error', function(error) {
            // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
            var fbDiv = document.getElementById('feedback');
            fbDiv.innerHTML += "<p>Error connecting to websocket server.</p>";
        });
        
// This function is called when the connection to rosbridge is closed
        rbServer.on('close', function() {
            // Write appropriate message to #feedback div upon closing connection to rosbridge
            var fbDiv = document.getElementById('feedback');
            fbDiv.innerHTML += "<p>Connection to websocket server closed.</p>";
        });
        
// [Topic]
//publishing to a Topic
/* turtle1/cmd_vel*/
        var cmdVelTopic = new ROSLIB.Topic({
            ros : rbServer,
            name : '/turtle1/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });
        
//Subscribing to a Topic
/* hello */
        var helloListener = new ROSLIB.Topic({
            ros : rbServer,
            name : '/roslibjs_hello_listener',
            messageType : 'std_msgs/String'
        });
        
        helloListener.subscribe(function(message) {
            console.log('Received message on ' + helloListener.name + ': ' + message.data);
            alert("HelloWorld now");
            helloListener.unsubscribe();
        });
        
/* communication */
        var comListener = new ROSLIB.Topic({
            ros : rbServer,
            name : '/roslibjs_communicate_listener',
            messageType : 'std_msgs/String'
        });
        
        comListener.subscribe(function(comMessage) {
            console.log('Received message on ' + comListener.name + ': ' + comMessage.data);
            var comFbMsg = document.getElementById('comMessageList');
            comFbMsg.innerHTML += comMessage.data + '<br>';
        });
        
/* Speech test */
        var speechASRRequest = new ROSLIB.Topic({
            ros : rbServer,
            name : '/web/asr_request',
            messageType : 'std_msgs/String'
        });
        
        speechASRRequest.subscribe(function(ASRMessage) {
            console.log('Received message on ' + speechASRRequest.name + ': ' + ASRMessage.data);
            var ASRFbMsg = document.getElementById('ASRMegRequest');
            ASRFbMsg.innerHTML += ASRMessage.data + '<br>';
        });
        
        var speechASRResult = new ROSLIB.Topic({
            ros : rbServer,
            name : '/web/asr_result',
            messageType : 'std_msgs/String'
        });
        
        speechASRResult.subscribe(function(ASRResult) {
            console.log('Received message on ' + speechASRResult.name + ': ' + ASRResult.data);
            var ASRFbMsgResult = document.getElementById('ASRMegRequest');
            ASRFbMsgResult.innerHTML += ASRResult.data + '<br>';
            myDispatch(ASRResult.data);      
        });
        
        var speechTTSRequest = new ROSLIB.Topic({
            ros : rbServer,
            name : '/web/tts_request',
            messageType : 'std_msgs/String'
        });
        
        speechTTSRequest.subscribe(function(TTSMessage) {
            console.log('Received message on ' + speechTTSRequest.name + ': ' + TTSMessage.data);
            var TTSFbMsg = document.getElementById('TTSMegRequest');
            TTSFbMsg.innerHTML += TTSMessage.data + '<br>';
        });
        
        var speechTTSStatus = new ROSLIB.Topic({
            ros : rbServer,
            name : '/web/tts_status',
            messageType : 'std_msgs/String'
        });
        
/* PersonDetect */
        var myPersonDetect = new ROSLIB.Topic({
            ros : rbServer,
            name : '/PersonDetect',
            messageType : 'leg_tracker/PersonArray'
        });
        
        var lastId=0;
        var counter=0;
        myPersonDetect.subscribe(function(PersonDetecFn) {
        
// Using JSON.stringify to get all message information.
// console.log('Received message on %s : and temp=%s',myPersonDetect.name,JSON.stringify(PersonDetecFn.people));
// find the last id
        var startAdd=JSON.stringify(PersonDetecFn.people).lastIndexOf("id");      
        var endAdd=JSON.stringify(PersonDetecFn.people).lastIndexOf("}");      
        var temp=Number(JSON.stringify(PersonDetecFn.people).substring(startAdd+4,endAdd));
        console.log('Received message on %s : id=%d ,counter=%d',myPersonDetect.name,startAdd,temp,counter);

// debug
// var ASRMsgTable = document.getElementById('ASRMegRequest');
// ASRMsgTable.innerHTML += "id:" + temp +" counter:"+ counter + '<br>';
        var delayMillis = 2000; //ms
        if(lastId!=temp){counter=0;}
            else{
                counter++;
                if(counter==5){
                    HelloSpeech();
                    setTimeout(function() {pubSpeechSW(1)}, delayMillis);
                    counter++;
                }
            }
            lastId=temp;
            console.log('lastID=%d',lastId);
        });
            
            
// [Function]
/* turtle1/cmd_vel*/
// Message format            
// These lines create a message that conforms to the structure of the Twist defined in our ROS installation
// It initalizes all properties to zero. They will be set to appropriate values before we publish this message.
        var twist = new ROSLIB.Message({
            linear : {
                x : 0.0,
                y : 0.0,
                z : 0.0
            },
            angular : {
                x : 0.0,
                y : 0.0,
                z : 0.0
            }
        });

        function pubMessage() {
            var linearX = 0.0;
            var angularZ = 0.0;
// get values from text input fields. Note for simplicity we are not validating.
            linearX = 0 + Number(document.getElementById('linearXText').value);
            angularZ = 0 + Number(document.getElementById('angularZText').value);

// Set the appropriate values on the message object
            twist.linear.x = linearX;
            twist.angular.z = angularZ;

// Publish the message
            cmdVelTopic.publish(twist);
        }        

/* communication */
        var comMsg = new ROSLIB.Message({
            data : ""
        });
        
        function pubComMessage(){
            var comMsgs = ""; comMsgs=document.getElementById('comText').value;
// Set the appropriate values on the message object
            comMsg.data = comMsgs;
            console.log('Send message'+ ': ' + comMsg.data);
// Publish the message 
            comListener.publish(comMsg);
        }

/* Speech test */
        var speechSW = new ROSLIB.Message({
            data : ""
        });
        
        function pubSpeechSW(i){
            if(i==1)
                speechSW.data = "startListen";
            else
                speechSW.data = "stopListen";
            console.log('Send message'+ ' : '+ speechSW.data);
            speechASRRequest.publish(speechSW);
        }
        
        var TTSSpeechMsg = new ROSLIB.Message({
            data : ""
        });
        
        function pubTTSSpeech(){
            var TTSSpeechMsgs = ""; TTSSpeechMsgs=document.getElementById('TTSText').value;
// Set the appropriate values on the message object
            TTSSpeechMsg.data = TTSSpeechMsgs;
            console.log('Send message'+ ': ' + TTSSpeechMsg.data);
// Publish the message 
            speechTTSRequest.publish(TTSSpeechMsg);
        }
        
        function HelloSpeech(){
            TTSSpeechMsg.data = "有什麼可以謂您服務的嗎？";
            speechTTSRequest.publish(TTSSpeechMsg);
        }
        
        function Then(str){
            TTSSpeechMsg.data = str;
            speechTTSRequest.publish(TTSSpeechMsg);
        }