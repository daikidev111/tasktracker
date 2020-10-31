function addComment(){
    var data = {
        comment_context : $("#comment_context").val()
    }
    $.ajax({
        url: '/auth/add_comment',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.success){
            $("#comment_context").val("");
            $('#add_comment_success').text(data.text);
            $('#add_comment_fail').text("");
        } else {
            $("#comment_context").val("");
            $('#add_comment_success').text("");
            $('#add_comment_fail').text(data.text);
        }
    })
}

//Fires when the modal is closed or hidden by the user
$("#add_comment").on('hide.bs.modal', function () {   
    window.location.reload();
});
