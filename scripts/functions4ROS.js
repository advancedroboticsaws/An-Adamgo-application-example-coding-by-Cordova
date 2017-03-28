//Change the ip to ROS_IP
//      var rbServer = new ROSLIB.Ros({url :'ws://localhost:9090'});
        var rbServer = new ROSLIB.Ros({url :'ws://192.168.30.18:9090'});
        
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
        
/* move_base */
        var move_baseListener = new ROSLIB.Topic({
            ros : rbServer,
            name : '/move_base/result',
            messageType : 'move_base_msgs/MoveBaseActionResult'
        });
        
        move_baseListener.subscribe(function(actionResult) {
            console.log('Received message on ' + move_baseListener.name + ': ' + actionResult.data);
            alert("Robot reach goal");
            move_baseListener.unsubscribe();
        });

// [Function]
/* turtle1/cmd_vel*/
// Message format            
// These lines create a message that conforms to the structure of the Twist defined in our ROS installation
// It initalizes all properties to zero. They will be set to appropriate values before we publish this message
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
// get values from text input fields. Note for simplicity we are not validating
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
        
/* move_base test */
        var actionClient = new ROSLIB.ActionClient({
            ros : rbServer,
            serverName : '/move_base',
            actionName : 'move_base_msgs/MoveBaseAction'
        });
        var positionVec3 = new ROSLIB.Vector3(null);
        var orientation = new ROSLIB.Quaternion({x:0, y:0, z:0.0, w:0.0});
        
        var pose = new ROSLIB.Pose({
           position : positionVec3,
           orientation : orientation
        });
        
        function sendGoal(pose) {
        // create a goal
            var goal = new ROSLIB.Goal({
                actionClient : actionClient,
                goalMessage : {
                    target_pose : {
                        header : {
                            frame_id : '/map'
                        },
                        pose : pose
                    }
                }
            });
            goal.send();
            move_baseListener.subscribe();
        }
        
        function SetLocation(){
            var setLocName= ""; setLocName=document.getElementById('SetLocNameText').value;
            var setLocPosX= ""; setLocPosX=document.getElementById('SetLocPosTextX').value;
            var setLocPosY= ""; setLocPosY=document.getElementById('SetLocPosTextY').value;
            var setLocPosZ= ""; setLocPosZ=document.getElementById('SetLocPosTextZ').value;
            
            var setLocOrientX= ""; setLocOrientX=document.getElementById('SetLocOrientTextX').value;
            var setLocOrientY= ""; setLocOrientY=document.getElementById('SetLocOrientTextY').value;
            var setLocOrientZ= ""; setLocOrientZ=document.getElementById('SetLocOrientTextZ').value;
            var setLocOrientW= ""; setLocOrientW=document.getElementById('SetLocOrientTextW').value;
            
            pose.position.x=parseFloat(setLocPosX);
            pose.position.y=parseFloat(setLocPosY);
            pose.position.z=parseFloat(setLocPosZ);
            pose.orientation.x=parseFloat(setLocOrientX);
            pose.orientation.y=parseFloat(setLocOrientY);
            pose.orientation.z=parseFloat(setLocOrientZ);
            pose.orientation.w=parseFloat(setLocOrientW);
            
            console.log(' SetLocation()'+ ': ' +'setLocName='+ setLocName);
            console.log('positionVec3.x='+ pose.position.x);
            console.log('positionVec3.y='+ pose.position.y);
            console.log('positionVec3.z='+ pose.position.z);
            
            console.log('orientation.x='+ pose.orientation.x);
            console.log('orientation.y='+ pose.orientation.y);
            console.log('orientation.z='+ pose.orientation.z);
            console.log('orientation.w='+ pose.orientation.w);
            
            sendGoal(pose);
        }
        
/* location_manager */
        function SendGol(){
            var setLocName= ""; setLocName=document.getElementById('GetLocPosTextNAME').value;
            var setLocPosX= ""; setLocPosX=document.getElementById('GetLocPosTextX').value;
            var setLocPosY= ""; setLocPosY=document.getElementById('GetLocPosTextY').value;
            var setLocPosZ= ""; setLocPosZ=document.getElementById('GetLocPosTextZ').value;
            
            var setLocOrientX= ""; setLocOrientX=document.getElementById('GetLocOrientTextX').value;
            var setLocOrientY= ""; setLocOrientY=document.getElementById('GetLocOrientTextY').value;
            var setLocOrientZ= ""; setLocOrientZ=document.getElementById('GetLocOrientTextZ').value;
            var setLocOrientW= ""; setLocOrientW=document.getElementById('GetLocOrientTextW').value;
           
            pose.position.x=parseFloat(setLocPosX);
            pose.position.y=parseFloat(setLocPosY);
            pose.position.z=parseFloat(setLocPosZ);
            pose.orientation.x=parseFloat(setLocOrientX);
            pose.orientation.y=parseFloat(setLocOrientY);
            pose.orientation.z=parseFloat(setLocOrientZ);
            pose.orientation.w=parseFloat(setLocOrientW);
            
            console.log(' SetLocation()'+ ': ' +'setLocName='+ setLocName);
            console.log('positionVec3.x='+ pose.position.x);
            console.log('positionVec3.y='+ pose.position.y);
            console.log('positionVec3.z='+ pose.position.z);
            
            console.log('orientation.x='+ pose.orientation.x);
            console.log('orientation.y='+ pose.orientation.y);
            console.log('orientation.z='+ pose.orientation.z);
            console.log('orientation.w='+ pose.orientation.w);
            
            sendGoal(pose);
        }

// location_manager/queryAllLocation
        var queryAllLocationClient = new ROSLIB.Service({
            ros : rbServer,
            name : '/queryAllLocation',
            serviceType : 'location_manager/queryAllLocation'
        });
        
        var requestqueryAllLocation = new ROSLIB.ServiceRequest({
            execute: true
        });
        
        function QueryAllLocation(){
            var locationName=document.getElementById('LocationName');
            var locationPosepos=document.getElementById('LocationPosepos');
            var locationPoseOrient=document.getElementById('LocationPoseOrient');
            
            queryAllLocationClient.callService(requestqueryAllLocation, function(result){
                console.log('Result for service call on ' + queryAllLocationClient.name + ': ' + result.result);
                var arrayLength=result.locationArray.location.length;
                if(arrayLength)
                    for(i=0;i<arrayLength;i++){
                    
                        locationName.innerHTML += result.locationArray.location[i].name + '<p>';
                        locationPosepos.innerHTML +='pose.position.x: '+ result.locationArray.location[i].pose.position.x + '<br>';
                        locationPosepos.innerHTML +='pose.position.y: '+ result.locationArray.location[i].pose.position.y + '<br>';
                        locationPosepos.innerHTML +='pose.position.z: '+ result.locationArray.location[i].pose.position.z + '<p>';

                        locationPoseOrient.innerHTML +='pose.orientation.x: '+ result.locationArray.location[i].pose.orientation.x + '<br>';
                        locationPoseOrient.innerHTML +='pose.orientation.y: '+ result.locationArray.location[i].pose.orientation.y + '<br>';
                        locationPoseOrient.innerHTML +='pose.orientation.z: '+ result.locationArray.location[i].pose.orientation.z + '<br>';
                        locationPoseOrient.innerHTML +='pose.orientation.w: '+ result.locationArray.location[i].pose.orientation.w + '<p>';
                    }
            });
        }

// location_manager/addLocation
        var addLocationClient = new ROSLIB.Service({
            ros : rbServer,
            name : '/addLocation',
            serviceType : 'location_manager/addLocation'
        });
        function AddLocation(){
            var setLocNameText= ""; setLocNameText=document.getElementById('SetLocNameText').value;
            var setLocNameTextStatus=document.getElementById('LocationName');
            
            var requestaddLocation = new ROSLIB.ServiceRequest({
                name: setLocNameText
            });
            
            addLocationClient.callService(requestaddLocation, function(result){
                console.log('Result for service call on ' + addLocationClient.name + ': ' +result.result);
            });
            CleanLocStatus();
            QueryAllLocation();
        }
// location_manager/deleteLocation
        var deleteLocationClient = new ROSLIB.Service({
            ros : rbServer,
            name : '/deleteLocation',
            serviceType : 'location_manager/deleteLocation'
        });
        function DeleteLocation(){
            var deleteLocationText= ""; deleteLocationText=document.getElementById('DeleteLocationText').value;
            var deleteLocNameTextStatus=document.getElementById('LocationName');
            
            var requestdeleteLocation = new ROSLIB.ServiceRequest({
                name: deleteLocationText
            });
            
            deleteLocationClient.callService(requestdeleteLocation, function(result){
                console.log('Result for service call on ' + deleteLocationClient.name + ': ' + result.result);
            });
            CleanLocStatus();
            QueryAllLocation();
        }

// location_manager/deleteAllLocation
        var deleteAllLocationClient = new ROSLIB.Service({
            ros : rbServer,
            name : '/deleteAllLocation',
            serviceType : 'location_manager/deleteAllLocation'
        });
        
        function DeleteAllLocation(){
            var requestdeleteAllLocation = new ROSLIB.ServiceRequest({
                execute: true
            });
            deleteAllLocationClient.callService(requestdeleteAllLocation, function(result){
                console.log('Result for service call on ' + deleteAllLocationClient.name + ': ' + result.result);
            });
            CleanLocStatus();
            QueryAllLocation();
        }

// location_manager/queryLocation
        var queryLocationClient = new ROSLIB.Service({
            ros : rbServer,
            name : '/queryLocation',
            serviceType : 'location_manager/queryLocation'
        });
        function QueryLocation(){
            var queryLocationText= ""; queryLocationText=document.getElementById('QueryLocationText').value;
            var queryLocNameTextStatus=document.getElementById('LocationName');
            var queryLocation = new ROSLIB.ServiceRequest({
                name: queryLocationText
            });
            
            queryLocationClient.callService(queryLocation, function(result){
                console.log('Result for service call on ' + queryLocationClient.name + ': ' + result.result);
                var getLocName= queryLocationText;
                var getLocPosX= result.pose.position.x;
                var getLocPosY= result.pose.position.y;
                var getLocPosZ= result.pose.position.z;
                
                var getLocOrientX= result.pose.orientation.x;
                var getLocOrientY= result.pose.orientation.y;
                var getLocOrientZ= result.pose.orientation.z;
                var getLocOrientW= result.pose.orientation.w;
                
                document.getElementById('GetLocPosTextNAME').innerHTML= getLocName + '<p>';
                document.getElementById('GetLocPosTextX').innerHTML= getLocPosX + '<p>';
                document.getElementById('GetLocPosTextY').innerHTML= getLocPosY + '<p>';
                document.getElementById('GetLocPosTextZ').innerHTML= getLocPosZ + '<p>';
                
                document.getElementById('GetLocOrientTextX').innerHTML= getLocOrientX + '<p>';
                document.getElementById('GetLocOrientTextY').innerHTML= getLocOrientY + '<p>';
                document.getElementById('GetLocOrientTextZ').innerHTML= getLocOrientZ + '<p>';
                document.getElementById('GetLocOrientTextW').innerHTML= getLocOrientW + '<p>';
            });
        }
        
        function CleanLocStatus(){
            document.getElementById('LocationName').innerHTML="";
            document.getElementById('LocationPosepos').innerHTML="";
            document.getElementById('LocationPoseOrient').innerHTML="";
        }