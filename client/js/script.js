$(function(){

  // some global var. var message will be use later as
  // function sneding messages finish
  var messages = [];
  var peer_id, name, conn;
  
  var peer = new Peer({
    key: '78flukfdfbcvj9k9',
    debug: 3,
    config: {'iceServers': [
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'turn:numb.viagenie.ca',
      credential: 'muazkh', username: 'webrtc@live.com' }
    ]}
  });
  $('#endcall').addClass('hidden');

  //generate the connection
  peer.on('open', function(){
    $('#id').text(peer.id);
    console.log(peer.socket.disconnected);
  });

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function getVideo(callback){
    navigator.getUserMedia({audio: true, video: true}, callback, function(error){
      console.log(error);
      alert('An error occured. Please try again');
    });
  }

    // success callback
  getVideo(function(stream){
    window.localStream = stream;
    // get the stream by video Id defined in client
    onReceiveStream(stream, 'my-camera');
  });

  function onReceiveStream(stream, element_id){
    var video = $('#' + element_id + ' video')[0];
    // create blob objectURl
    video.src = window.URL.createObjectURL(stream);
    window.peer_stream = stream;
  }

  //get, change video resolution
  function changeMyVideoResolution(){

  }

  function changePeerVideoResolution(){

  }

  //user can capture image
  function captureImage(){

  }

  //user can turn off the video, or mute the mic
  function mediaChange(){
    //this should be separated into 2 functions
  }

  // ***End get video stream, now implement call function***

  $('#call').click(function(){
    name = $('#name').val();
    peer_id = $('#peer_id').val();
      if(peer_id){
        conn = peer.connect(peer_id, {metadata: {
          'username': name
        }});
      }

      console.log('now calling: ' + peer_id);
      console.log(peer);

      //get the target/friend peerID to call
      var call = peer.call(peer_id, window.localStream);
      call.on('stream', function(stream){
        window.peer_stream = stream;
        onReceiveStream(stream, 'peer-camera');
      });

  });

  //start the connection
  peer.on('connection', function(connection){
    conn = connection;
    peer_id = connection.peer;

    $('#peer_id').addClass('hidden').val(peer_id);
    $('#connected_peer_container').removeClass('hidden');
    $('#connected_peer').text(connection.metadata.username);
  });

  peer.on('call', function(call){
    onReceiveCall(call);
  });

  // run call received function
  function onReceiveCall(call){
    call.answer(window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
    $('#call').addClass('hidden');
    $('#endcall').removeClass('hidden');
  }

  //now implement function endCall. close the peer connection
  $("#endcall").click(function(call){
   peer.destroy();
   //need to fix the UI , when call is ended, the video should
   //be hidden? show user active instead?
   peer = null;
  })
  peer.on('close', function(){
    $('#endcall').addClass('hidden');
    $('#call').removeClass('hidden');
  });

  $("#pausecall").toggle(function(){
    peer.disconnect();
    $('#pausecall').innerHTML = "Unpause call";
    console.log("DCed");
  }, function(){
    peer.reconnect();
    $('#pausecall').innerHTML = "Pause call";
    console.log("Rec");
  });
  peer.on('disconnected', function(){
    //save the current state/image of the video
  })

  // implement disconnected and reconnect function, in case we need the pause. uncomment from 122 to 128
  // peer.on('disconnected', function(){
  //     // Emitted when the peer is disconnected from the signalling server,
  //     // either manually or because the connection to the signalling server was lost
 // http://peerjs.com/docs/ read the docs for more info
  //     //then try to reconnect with this function
  //     peer.reconnect();
  // })
});
