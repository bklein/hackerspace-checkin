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

reset = function() {
  //go back to the default state
  $("#gallery").hide();
  $("#webcam").show();
  $("#gallery").empty();
}

toggleWebcamState = function() {
  if($("#take-photo-btn").attr("data-photo") === "true") {
    $(".trigger").click();

    $("#webcam").hide();
    $("#take-photo-btn").text("Retake photo");
    $("#take-photo-btn").removeClass("btn-info");
    $("#take-photo-btn").addClass("btn-warning");
    $("#take-photo-btn").attr("data-photo", "false");
  }
  else { //go back to pic state
    $("#gallery").hide();
    $("#gallery").empty();
    $("#webcam").show();
    $("#take-photo-btn").text("Say cheese!");
    $("#take-photo-btn").removeClass("btn-warning");
    $("#take-photo-btn").addClass("btn-info");
    $("#take-photo-btn").attr("data-photo", "true");
  }
}

$(document).ready(function() {

  $("#webcam").photobooth();

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

      toggleWebcamState();
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

  $("#take-photo-btn").click( function(e) {
    e.preventDefault();

    toggleWebcamState();
  });

  $("#webcam").on("image", function(e, dataUrl){
    $("#gallery").html("<img src=\"" + dataUrl + "\" />");
    $("#gallery").show();
  });
});

