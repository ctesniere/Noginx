// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Initialise la table des infos des utilisateurs
    populateTable();

    // Ajout de l'evenement pour le click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Remplie la table des users
function populateTable() {

    // Initialise la variable
    var tableContent = '';

    // Appel en Ajax pour JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="/users/edit/' + this._id + '">edit</a></td>';
            tableContent += '<td><a href="/chat?username=' + this.username + '">Go !</a>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoUserName').text(thisUserObject.username);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

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
                    $('#msgSuccess').text("Confirmation: Nouvel utilisateur enregistré !").addClass("visible");
                }
                else {

                    // If something goes wrong, alert the error message that our service returned
                    $('#msgDanger').text('Error: ' + response.msg).addClass("visible");
                }
            });
    } else {
        // If errorCount is more than 0, error out
        $('#msgDanger').text('Please fill in all fields').addClass("visible");
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

                // Check for a successful (blank) response
                if (response.msg === '') {
                    $('#userInfoUserName').text("-");
                    $('#userInfoEmail').text("-");
                    $('#userInfoName').text("-");
                    $('#userInfoAge').text("-");
                    $('#userInfoGender').text("-");
                    $('#userInfoLocation').text("-");
                } else {
                    alert('Error: ' + response.msg);
                }

                // Update the table
                populateTable();
            });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }

};
