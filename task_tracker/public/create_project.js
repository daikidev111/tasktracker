//Fires when create project button is clicked
function createProject(){
    var data = {
        project_name: $("#project_name").val(),
        description: $("#description").val()
    }
    $.ajax({
        url: '/auth/create_project',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.success){
            $("#project_name").val("");
            $("#description").val("");
            $('#create_project_success').text(data.text);
            $('#create_project_fail').text("");
        } else {
            $("#project_name").val("");
            $("#description").val("");
            $('#create_project_fail').text(data.text);
            $('#create_project_success').text("");
        }
    })
}

//Fires when the detail button is clicked
function detail(id){
    var data = {
        project_id: id
    }
    $.ajax({
        url: '/auth/details',
        method: 'POST',
        data: data,
    }).done(function (data) {
        window.location.href = "/student_allocation";
    })
}

//Fires when delete project button is clicked
function deleteProject(id){
    let project_name = $(`#project${id}`).val();
    var data = {
        project_name: project_name
    }
    $.ajax({
        url: '/auth/delete',
        method: 'POST',
        data: data,
    }).done(function (data) {
        window.location.reload();
    })
}

//Fires when the modal is closed or hidden by the user
$("#create_project").on('hide.bs.modal', function () {   
    window.location.reload();
});


