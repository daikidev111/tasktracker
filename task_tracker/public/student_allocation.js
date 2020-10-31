function allocateStudents(id) {
    let username = $(`#allocate${id}`).val();
    let label = "#allocate_label" + String(id);
    let data = {
        student: username
    }
    $.ajax({
        url: '/auth/student_allocation',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.prompt) {
            $("#Prompt").text("A project cannot have more than 10 students!");
        } else {
            $(label).text("");
        }
    })
}

function deallocateStudents(id) {
    let username = $(`#deallocate${id}`).val();
    let label = "#deallocate_label" + String(id);
    let data = {
        student: username
    }
    $.ajax({
        url: '/auth/student_deallocation',
        method: 'POST',
        data: data,
    }).done(function (data) {
        $(label).text("");
    })
}

//Fires when the modal is closed or hidden by the user
$("#student_allocation").on('hide.bs.modal', function () {
    window.location.reload();
});

$("#student_deallocation").on('hide.bs.modal', function () {
    window.location.reload();
});
