// borrowed from stackoverflow
function dataURItoBlob(dataURI){

  var byteString; 
  if (dataURI.split(',')[0].indexOf('base64') == -1){
    byteString = unescape(dataURI.split(',')[1]);
  } else {
    var byteString = atob(dataURI.split(',')[1]);
  }

  // sep out mime
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write to array buffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++){
    ia[i] = byteString.charCodeAt(i);
  }

  // write array buffer to blob
  var bb = new BlobBuilder();
  bb.append(ab);
  return bb.getBlob(mimeString);
}

$(document).ready(function() {

  $("#checkin-btn").on('click', function(){
    name = $("#checkin-name").val() || "";
    msg = $("#checkin-msg").val() || "";
    dataURI = $("#gallery img").attr("src") || "";
    $.ajax({
      type: "POST",
      url: "/checkin",
      data: {
        name: name,
        checkin_msg: msg,
        dataURI: dataURI
      }
    }).done(function(msg) {
      $("#checkin-name").val("");
      $("#checkin-msg").val("");
      $("#check-ins").prepend(msg);
    });
  });

  $("#check-ins").on('click', ".checkout", function(){
    id = $(this).attr('data-checkin');
    msg = "Leave a quick message, if you want...";
    alertify.set({labels: {ok: "Checkout", cancel: "Stay a while"}});
    alertify.prompt(msg, function(e, response){
      if (e){
        $.ajax({
          type: "POST",
          url: "/checkout",
          data: {
            id: id,
            checkout_msg: response
          }
        }).done(function(msg){
          $("#checkin-" + id).remove();
          $("#check-outs").prepend(msg);
        });
      } else {
      }
    });
  });

  $("#webcam").photobooth().on("image", function(e, dataUrl){
    alertify.log('took a pic');
    $("#gallery").html("<img src=\"" + dataUrl + "\" />");
  });
});

