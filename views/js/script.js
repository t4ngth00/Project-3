$(function(){

  // some global var. var message will be use later as
  // function sending messages finish
  var messages = [];
  var peer_id, name, conn;

  var peer = new Peer('hehe' ,{
    key: '78flukfdfbcvj9k9',
    debug: 3,
    config: {'iceServers': [
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'turn:numb.viagenie.ca',
      credential: 'muazkh', username: 'webrtc@live.com' }
    ]}
  });

  //generate the id the connection
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

       $('#call').addClass('hidden');
       $('#endcall').removeClass('hidden');
       $('#set-name').removeClass('hidden');
  });

  $('#set-name').click(function(){
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
    $('#id-input-field').addClass('hidden');
    $('#connected_peer').text(connection.metadata.username);

    $('#call').addClass('hidden');
    $('#endcall').removeClass('hidden');
    $('#set-name').removeClass('hidden');
  });

  peer.on('call', function(call){
    onReceiveCall(call);
  });

// run received function
  function onReceiveCall(call){
    call.answer(window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
  }

//now implement endCall function. close the peer connection
  $("#endcall").click(function(call){
   peer.destroy();
   peer = null;
  })

});
