$(document).ready(function() {

  $("#checkin-btn").on('click', function(){
    name = $("#checkin-name").val() || "";
    msg = $("#checkin-msg").val() || "";
    $.ajax({
      type: "POST",
      url: "/checkin",
      data: {
        name: name,
        checkin_msg: msg
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
  });
});

