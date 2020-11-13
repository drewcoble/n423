import * as App from "../app/app.js";
var _db;
var uid;

export function initFirebase() {
    // console.log("initFirebase");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = firebase.auth().currentUser.uid; 
            console.log(user);
            _db = firebase.firestore();
            getAllJokes();
        } else {
            console.log("no user");
            _db = "";
            uid = null;
            signInAnon();
        }
});
}

export function signInAnon(callback) {

    firebase
    .auth()
    .signInAnonymously()
    .then(function(result) {
        console.log("anon signed in");
        _db = firebase.firestore();
        getAllJokes()
    })
}

export function getAllJokes() {
    // console.log("getAllJokes");
    _db
    .collection("jokes")
    .get()
    .then(function(querySnapshot) {
        App.displayJokes(querySnapshot);
        App.initCardListeners();
    })
}

export function checkLol(id) {
    let jokeRef = _db.collection("jokes").doc(id); 

    jokeRef
    .get()
    .then(function(doc) {
       let joke = doc.data();

       if (joke.lols.includes(uid)) {
            $(`#${id}`).addClass("lol-clicked");
       }
    });
}

export function toggleLol(id) {

    let jokeRef = _db.collection("jokes").doc(id); 

    jokeRef
    .get()
    .then(function(doc) {
    //    console.log(doc.id);
    
       let joke = doc.data();
       let lolCount = joke.lols.length;

       if (joke.lols.includes(uid)) {
            // console.log("it's in there")
            jokeRef.update({
                lols: firebase.firestore.FieldValue.arrayRemove(uid)
            })
            .then(function() {
                $(`#lol-num-${id}`).html(lolCount - 1);
                $(`#${id}`).removeClass("lol-clicked");
            });
       }
       else {
            jokeRef.update({
                lols: firebase.firestore.FieldValue.arrayUnion(uid)
            })
            .then(function() {
                $(`#lol-num-${id}`).html(lolCount + 1);
                $(`#${id}`).addClass("lol-clicked");
            });
        //    console.log("it's not in there");
       }
        // console.log(querySnapshot);
    });
}

export function signIn(email,password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
        } else {
        alert(errorMessage);
        }
        console.log(error);
        // document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
}


export function signUp(email,password,displayName) {
    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
        firebase.auth().currentUser.updateProfile({
            displayName: displayName
            }).then(function() {
            // Update successful.
            }).catch(function(error) {
            // An error happened.
            console.log(error);
            }
        );
    })
    .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
    } else {
        alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
    });


}