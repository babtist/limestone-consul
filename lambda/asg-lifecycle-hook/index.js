const AWS = require('aws-sdk');
const http = require('http');
var as = new AWS.AutoScaling();


exports.handler = (event, context, callback) => {
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log("SNS message contents. \nMessage:\n", message);
  var params = {
      "AutoScalingGroupName" : message.AutoScalingGroupName,
      "LifecycleHookName" : message.LifecycleHookName,
      "LifecycleActionToken" : message.LifecycleActionToken,
      "LifecycleActionResult" : "ABANDON"
    };

  // Get host name and port from metadata
  var metaData = JSON.parse(message.NotificationMetadata);

  forceLeaveConsulNode(message.EC2InstanceId, metaData.LoadBalancerDNSName, metaData.Port, function() {
    completeLifecycleAction(params);
  });

  function forceLeaveConsulNode(instanceId, host, port, callback) {
     var req = http.get('http://'+host+':'+port+'/v1/agent/force-leave/' + instanceId, function(res) {
         console.log(`Got response: ${res.statusCode}`);
         res.resume();
         callback();
     }).on('error', (e) => {
         console.log(`Got error: ${e.message}`);
         callback();
     });
  }


  function completeLifecycleAction(params) {
      as.completeLifecycleAction(params, function(err, data){
          if (err) {
            console.log("CompleteLifecycleAction lifecycle completion failed.\nDetails:\n", err);
            callback(err);
          } else {
            console.log("CompleteLifecycleAction Successful.\nReported:\n", data);
            callback(null);
          }
        });
  };
};
