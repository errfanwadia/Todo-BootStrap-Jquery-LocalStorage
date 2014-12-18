$(document).ready(function() {

    $(function() {
        $("#todos").sortable({
            axis: 'y',
            update: function(event, ui) {
                var data = $(this).sortable('toArray').toString();
                var order = data.split(',').map(function(x) {
                    return parseInt(x)
                });;
                localStorage["order"] = JSON.stringify(order);
            }
        });
    });

    function bindEvent() {
        $("a").click(function(e) {
            console.log("Delete Called");
            removeID = $(this).parent().attr('id');
            var todos = JSON.parse(localStorage["todos"]);
            console.log(removeID);
            i = parseInt(removeID);
            console.log("Remove ID: " + i);

            t_length = todos.length;
            for (var x = 0; x < t_length; x++) {
                if (todos[x]) {

                    if (todos[x][2] == i) {
                        removeOrder = todos[x][2];
                        todos.splice(x, 1);
                        localStorage["todos"] = JSON.stringify(todos);
                        $(this).parents('li').remove();

                        var order = JSON.parse(localStorage["order"]);
                        var orderindex = order.indexOf(removeOrder);
                        console.log("Remove Order ID: " + orderindex);
                        if (orderindex != -1) {
                            order.splice(orderindex, 1);
                            localStorage["order"] = JSON.stringify(order);
                        }
                    }
                }
            }

        });

        $('input[type="checkbox"]').click(function(e) {

            id = $(this).parent().attr('id');
            console.log(id);
            var todos = JSON.parse(localStorage["todos"]);
            i = parseInt(id);
            if (todos[i][1]) {
                todos[i][1] = false;
                console.log($(this).next().children().contents().unwrap());
            } else {
                todos[i][1] = true;
                $(this).next().wrapInner("<s></s>");
            }

            localStorage["todos"] = JSON.stringify(todos);

        });
    }

    function loadToDos() {
        if (localStorage['todos']) {
            var todos = JSON.parse(localStorage["todos"]);
            var order = JSON.parse(localStorage["order"]);
            var todosLength = todos.length;
            var orderLength = order.length;
            for (var i = 0; i < orderLength; i++) {
                for (var j = 0; j < todosLength; j++) {
                    //                    $("#todos").empty();
                    if (todos[j][2] == order[i]) {
                        console.log("called");
                        if (todos[j][1] == true)
                            $('#todos').append("<li class='list-group-item' id='" + todos[j][2] + "'><input name='check' type='checkbox' checked/><label class=''><s>" + todos[j][0] + "</s></label><a href=#><span class='glyphicon glyphicon-remove' href='#'></a></span></li>");
                        else
                            $('#todos').append("<li class='list-group-item' id='" + todos[j][2] + "'><input name='check' type='checkbox'/><label class=''>" + todos[j][0] + "</label><a href=#><span class='glyphicon glyphicon-remove' href='#'></span></a></li>");
                    }
                }
            }

        }
        bindEvent();
    }

    loadToDos();

    // clear all the local storage
    $('#clear').click(function() {
        window.localStorage.clear();
        location.reload();
        return false;
    });

    $('#add').click(function() {

        var Description = $('#description').val();
        if ($("#description").val() == '') {
            $('#alert').html("<strong>Warning!</strong> You left the to-do empty");
            $('#alert').fadeIn().delay(1000).fadeOut();
            return false;
        }
        $("#description").val("");
        //                $('#form')[0].reset();
        var count = null;
        if (localStorage["todos"] == null) {
            var todos = new Array();
            todos[0] = new Array();
            todos[0][0] = Description;
            todos[0][1] = false;
            todos[0][2] = 0
            localStorage["todos"] = JSON.stringify(todos);

            var order = new Array();
            order = [0];
            localStorage["order"] = JSON.stringify(order);

            count = 0;
        } else {
            var order = JSON.parse(localStorage["order"]);
            var count = Math.max.apply(Math, order);
            count++;
            order.unshift((count));
            localStorage["order"] = JSON.stringify(order);
            
            var todos = JSON.parse(localStorage["todos"]);
            todos.push([Description, false, count]);
            localStorage["todos"] = JSON.stringify(todos);
        }
        $('#todos').prepend("<li class='list-group-item' id='" + (count) + "'><input name='check' type='checkbox'/><label class=''>" + Description + "</label><a href=#><span class='glyphicon glyphicon-remove' href='#'></a></span></li>");
        bindEvent();
        return false;
    });
});