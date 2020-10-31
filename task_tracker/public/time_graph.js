// create chart at the start of the app
create_chart()

// Draw the chart and set the chart values
function draw_expected_chart(data,task) {
    var data_2 = [];
    data_2[0] = ["Name", "Hours"];
    var count = 1;
    for (const [key, value] of Object.entries(data)) {
        data_2[count] = [key, value];
        count += 1;
    }
    var chart_data = google.visualization.arrayToDataTable(data_2);
    var title = 'Expected hours spend on ' + String(task)

    // Optional; add a title and set the width and height of the chart
    var options = { 'title': title, 'width': 600, 'height': 500 };

    // Display the chart inside the <div> element with id="expected_time_chart"
    var chart = new google.visualization.PieChart(document.getElementById('expected_time_chart'));
    chart.draw(chart_data, options);
}

// Draw the chart and set the chart values
function draw_actual_chart(data,task) {
    var data_2 = [];
    data_2[0] = ["Name", "Hours"];
    var count = 1;
    for (const [key, value] of Object.entries(data)) {
        data_2[count] = [key, value];
        count += 1;
    }

    var chart_data = google.visualization.arrayToDataTable(data_2);
    var title = 'Actual hours spend on ' + String(task)
    // Optional; add a title and set the width and height of the chart
    var options = { 'title': title, 'width': 600, 'height': 500 };

    // Display the chart inside the <div> element with id="actual_time_chart"
    var chart = new google.visualization.PieChart(document.getElementById('actual_time_chart'));
    chart.draw(chart_data, options);
}

// fires when user want to add actual time
function addActual() {
    var data = {
        start_time: $("#start_time").val(),
        end_time: $("#end_time").val()
    }
    $.ajax({
        url: '/auth/enter_actual_time',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.success) {
            $("#start_time").val("");
            $("#end_time").val("");
            $('#add_time_success').text(data.text);
            $('#add_time_fail').text("");
            create_chart();
        } else {
            $("#start_time").val("");
            $("#end_time").val("");
            $('#add_time_fail').text(data.text);
            $('#add_time_success').text("");
        }
    })
}

// Fire when add expected work time is pressed
function addExpected(){
    var data={
        expected_time: $("#expected_time").val()
    }
    $.ajax({
        url: '/auth/addExpected',
        method: 'POST',
        data: data,
    }).done(function (data) {
        if (data.success) {
            $("#expected_time").val("");
            $('#add_expected_time_success').text(data.text);
            $('#add_expected_time_fail').text("");
            create_chart();
        } else {
            $("#expected_time").val("");
            $('#add_expected_time_fail').text(data.text);
            $('#add_expected_time_success').text("");
        }
    })
}
// Fires when which task button is pressed
function changeTask(index){
    var data = {
        index: index
    }
    $.ajax({
        url: '/auth/change_task',
        method: 'POST',
        data: data,
    }).done(function (data) {
            if (data.success) {
                create_chart();
        }
    })
}

// create expected time chart
function create_chart() {
    $(document).ready(function () {
        $.ajax({
            url: '/auth/draw_chart',
            type: 'POST',
            success: function (response) {
                if (response) {
                    google.charts.load('current', { 'packages': ['corechart'] });
                    google.charts.setOnLoadCallback(function () { draw_expected_chart(response[0],response[2]); });
                    google.charts.setOnLoadCallback(function () { draw_actual_chart(response[1],response[2]); });
                }
            }
        })
    })
}

