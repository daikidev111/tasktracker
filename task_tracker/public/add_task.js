function addTask(){
    var data = {
        task_name : $("#task_name").val()
    }
    $.ajax({
        url: '/auth/add_task',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.success){
            $("#task_name").val("");
            $('#add_task_success').text(data.text);
            $('#add_task_fail').text("");
        } else {
            $("#task_name").val("");
            $('#add_task_success').text("");
            $('#add_task_fail').text(data.text);
        }
    })
}

//Fires when the modal is closed or hidden by the user
$("#add_task").on('hide.bs.modal', function () {   
    window.location.reload();
});
