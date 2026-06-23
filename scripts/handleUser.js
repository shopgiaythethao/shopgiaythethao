var dataUsers = [];
loadFromLocalStorage(); // init load data

function saveToLocalStorage () {
    localStorage.setItem('users', JSON.stringify(dataUsers));
}

function loadFromLocalStorage () {
    var data = localStorage.getItem('users');
    if (data) {
        dataUsers = JSON.parse(data);

    }


}


function checkExistUser (username) {
    for (var i = 0; i < dataUsers.length; i++) {
        if (dataUsers[i].username === username) {
            return true;
        }
    }
    return false;
}

function addUser (username, password) {
    if (checkExistUser(username)) return false;
    var user = {
        username,
        password,
        order_lists: []
    }
    dataUsers.push(user);
    saveToLocalStorage();
    return true;
}


function login (username, password) {
 
    for (var i = 0; i < dataUsers.length; i++) {
        if (dataUsers[i].username === username && dataUsers[i].password === password) {
            saveCurrentUser(username);
            return true;
        }
    }
    return false;
}


function saveOrderLists (username, order_lists) {
    for (var i = 0; i < dataUsers.length; i++) {
        if (dataUsers[i].username === username) {
            dataUsers[i].order_lists = order_lists;
            saveToLocalStorage();
            return true;
        }
    }
}

function getOrderLists (username) {
    for (var i = 0; i < dataUsers.length; i++) {
        if (dataUsers[i].username === username) {
            return dataUsers[i].order_lists;
        }
    }
    return [];
}
function saveCurrentUser (username) {
    localStorage.setItem('currentUser', username);
}

function getCurrentUser () {
    return localStorage.getItem('currentUser');
}