// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Initialise la table des infos des utilisateurs
    getListUser();

    // Ajout de l'evenement pour le click
    $('#btnAddUser').on('click', addUser);
    $('#btnSearch').on('click', searchUser);
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#userInfo').on('click', 'a.linkdeleteuser', deleteUser);

    var alert = document.getElementsByClassName('alert');
    for (var i = 0; i < alert.length; ++i) {
        console.log(alert[i].innerText);
        if (alert[i].innerText)
            alert[i].style.display = "block";
    };
});

/**
 * Remplie la table des users
 */
function populateTable(data) {
    userListData = data;
    var tableContent = '';
    $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '</tr>';
    });
    $('#userList table tbody').html(tableContent);
};

/**
 * Recupere la liste de tous les utilisateurs en AJAX
 */
function getListUser() {
    $.getJSON( '/users/list', function( data ) {
        populateTable(data);
    });
}

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Recupere l'objet basé sur la valeur de l'index
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Recupere votre objet User
    var thisUserObject = userListData[arrayPosition];

    // Remplie les info de l'user
    $('#userInfoUserName').text(thisUserObject.username);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    var builderAction = "";
    if (true) { // TODO use cookie
        builderAction += '<a href="#" class="linkdeleteuser" rel="' + thisUserObject._id + '">Delete</a> | ';
        builderAction += '<a href="/users/edit/' + thisUserObject._id + '">Edit</a></td><br><br>';
    }
    $('#actionUser').html(builderAction);


    var builderMessage = "";
    if (thisUserObject.message != null && thisUserObject.message.length > 0) {
        for (var i = 0; i < thisUserObject.message.length; ++i) {
            builderMessage += '<div>' + thisUserObject.message[i] + '</div>';
        }
    }
    $('#messageUser').html(builderMessage);

    if (thisUserObject.picture != null && thisUserObject.picture.length > 0) {
        $('#pictureUser').html('<img src="' + thisUserObject.picture + '" class="img-circle"><br><br>');
    }

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val(),
            'password': $('#addUser fieldset input#inputUserPassword').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/add',
            dataType: 'JSON'
        }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#addUser fieldset input').val('');
                    $('#msgDanger').removeClass("visible");
                    $('#msgSuccess').text("Confirmation: Nouvel utilisateur enregistré !").addClass("visible");;

                } else {

                    // If something goes wrong, alert the error message that our service returned
                    $('#msgDanger').text('Error: ' + response.msg).addClass("visible");;
                }
            });
    } else {
        $('#msgDanger').text('Renseigner tous les champs').addClass("visible");;
        return false;
    }
};


// Add User
function searchUser(event) {
    event.preventDefault();

    // If it is, compile all user info into one object
    var search = {
        'username': $('#searchUser fieldset input#inputUserName').val(),
        'email': $('#searchUser fieldset input#inputUserEmail').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: search,
        url: '/users/search',
        dataType: 'JSON'
    }).done(function( response ) {
            console.log(response);
            populateTable(response);
            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

            } else {

                // If something goes wrong, alert the error message that our service returned
                $('#msgDanger').text('Error: ' + response.msg).addClass("visible");;
            }
        });
};

// Add User
function edit(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#addUser fieldset input').val('');
                    $('#msgDanger').removeClass("visible");
                    $('#msgSuccess').text("Confirmation: Nouvel utilisateur enregistré !").addClass("visible");;
                } else {

                    // If something goes wrong, alert the error message that our service returned
                    $('#msgDanger').text('Error: ' + response.msg).addClass("visible");;
                }
            });
    } else {
        $('#msgDanger').text('Renseigner tous les champs').addClass("visible");;
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this user?');

    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

                if (response.msg === '') {
                    $('#userInfoUserName').text("-");
                    $('#userInfoEmail').text("-");
                    $('#userInfoName').text("-");
                    $('#userInfoAge').text("-");
                    $('#userInfoGender').text("-");
                    $('#userInfoLocation').text("-");
                    $('#actionUser').text("");
                } else {
                    alert('Error: ' + response.msg);
                }

                // Update the table
                getListUser();
            });

    } else {
        return false;
    }

};
