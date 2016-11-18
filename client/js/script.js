$(function(){

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

  peer.on('open', function(){
    $('#id').text(peer.id);
  });

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function getVideo(callback){
    navigator.getUserMedia({audio: true, video: true}, callback, function(error){
      console.log(error);
      alert('An error occured. Please try again');
    });
  }

  getVideo(function(stream){
    window.localStream = stream;
    onReceiveStream(stream, 'my-camera');
  });

  function onReceiveStream(stream, element_id){
    var video = $('#' + element_id + ' video')[0];
    video.src = window.URL.createObjectURL(stream);
    window.peer_stream = stream;
  }

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
      var call = peer.call(peer_id, window.localStream);
      call.on('stream', function(stream){
        window.peer_stream = stream;
        onReceiveStream(stream, 'peer-camera');
      });
  });

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

  function onReceiveCall(call){
    call.answer(window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
  }

});
