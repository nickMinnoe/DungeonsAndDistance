"use strict";

$(document).ready(function() {

    function handleError(message) {
        //add errorHandling
        console.log(message);
        $('#error').text(message);
    }
    
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#makeCharSubmit").on("click", function(e) {
        e.preventDefault();
    
        if($("#charName").val() == '' || $("#charAge").val() == '') {
            handleError("All fields are required");
            return false;
        }

        sendAjax($("#charForm").attr("action"), $("#charForm").serialize());
        
        return false;
    });
    
});