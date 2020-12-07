import * as App from "../app/app.js";
var _db;
var _user;

export function initFirebase(callback) {
    //connect to firestore
    _db = firebase.firestore();
    // console.log('connected to firebase');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            _user = firebase.auth().currentUser; 
            // console.log("User: ", _user);
            App.setSignInOut('SignedIn');
            // console.log(user.uid);
            getJokesByUserId(App.displayUserPageContent, user.uid)
        } else {
            // console.log("no user");
            _user = null;
            App.setSignInOut('SignedOut');
            getAllJokes(callback);
        }
        
        // App.displayCreateJokeContent();
});
}

export function checkUserForMatch(userId) {
    if (_user.uid == userId) {
        // console.log("this is the user's page");
        return true;
    }
    else {
        // console.log("this is not the user's page");
        return false;
    }
}

export function getAllJokes(callback) {
    // console.log("getAllJokes");
    
    _db
    .collection("jokes")
    .orderBy("timestamp", "desc")
    .get()
    .then(function(querySnapshot) {
        //callback function displays home page
        callback(querySnapshot);
    })
}

export function getFilterJokes(filterSelect, callback) {
    // console.log("getFilterJokes");

    let filterSelectArray = filterSelect.split("-");
    let filterString = "";

    for(let i = 1; i < filterSelectArray.length; i++) {
        if (i != filterSelectArray.length -1) {
            filterString = filterSelectArray[i] + " ";
        }
        else {
            filterString += filterSelectArray[i];
        }
    }

    // console.log(filterString);


    if(filterString == "All Jokes") {
        getAllJokes(callback);
    }
    else {
        _db.collection("jokes")
        .where("category", "==", filterString)
        .orderBy("timestamp", "desc")
        .get()
        .then(function(querySnapshot) {
            callback(querySnapshot);
        })
    }
}

export function getJokeById(jokeId, callback) {
    _db
    .collection("jokes")
    .doc(jokeId)
    .get()
    .then((doc) => {
        let jokeData = doc.data();
        callback(jokeId, jokeData);
    })
}

export function getJokesByUserId(callback, userId) {
    // console.log('getJokesByUserId', userId);

    //if no userId is passed, set it to current user's id
    if (!userId) {
        userId = _user.uid;
    }

    _db
    .collection("jokes")
    .where("uid", "==", userId)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
        callback(querySnapshot, userId);
        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // })

    })
}

export function checkForLol(id) {

    if(_user) {
        let jokeRef = _db.collection("jokes").doc(id); 

        jokeRef
        .get()
        .then(function(doc) {
            let joke = doc.data();

            if (joke.lols.includes(_user.uid)) {
                $(`#${id}`).addClass("lol-clicked");
            }
        });
    }
}

export function toggleLol(id) {

    // if the user is signed in they can LOL at a joke
    if (_user) {
        let jokeRef = _db.collection("jokes").doc(id); 

        jokeRef
        .get()
        .then(function(doc) {
        //    console.log(doc.id);
        
        let joke = doc.data();
        let lolCount = joke.lols.length;

        if (joke.lols.includes(_user.uid)) {
                // console.log("it's in there")
                jokeRef.update({
                    lols: firebase.firestore.FieldValue.arrayRemove(_user.uid)
                })
                .then(function() {
                    $(`#lol-num-${id}`).html(lolCount - 1);
                    $(`#${id}`).removeClass("lol-clicked");
                });
        }
        else {
                jokeRef.update({
                    lols: firebase.firestore.FieldValue.arrayUnion(_user.uid)
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
    //display message for user to sign in/sign up to LOL at a joke
    else {
        let message = `Please Sign In or Sign Up so we know who's laughing.`;
        $('#alert-message').html(message);
        $('.alert-container').removeClass('hidden');
    }
}

export function createNewJoke(jokeData, callback) {
    // add uid and username to jokeData
    jokeData.uid = _user.uid;
    jokeData.user = _user.displayName;

    // Add a new document with a generated id.
    _db.collection("jokes").add({
        category: jokeData.category,
        content: jokeData.content,
        lols: [],
        rating: jokeData.rating,
        uid: jokeData.uid,
        user: jokeData.user,
        timestamp: firebase.firestore.Timestamp.now()
    })
    .then(function(docRef) {
        // console.log("Document written with ID: ", docRef.id);
        getJokesByUserId(callback);
    })
    .catch(function(error) {
        // console.error("Error adding document: ", error);
    });
}

export function editJoke(jokeID, jokeData, callback) {
    // assemble the data - only the parts the user can update
    let thisUpdate = {
        category: jokeData.category,
        content: jokeData.content,
        rating: jokeData.rating,
        timestamp: firebase.firestore.Timestamp.now()
    }
    
    // update the document in firestore
    _db.collection("jokes")
    .doc(jokeID)
    .update(thisUpdate)
    .then(()=>{
        // console.log('edited successfully')
        getJokesByUserId(callback);
    });

}

export function deleteJoke(jokeID, callback) {
    _db.collection("jokes")
    .doc(jokeID)
    .delete()
    .then(()=> {
        // console.log('deleted successfully');
        getJokesByUserId(callback);
    });
}




/* * * * Methods for user auth * * * */

export function signIn(email,password) {
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
        } else {
        alert(errorMessage);
        }
        // console.log(error);
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
            // console.log(error);
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
    // console.log(error);
    // [END_EXCLUDE]
    });


}

export function signOut() {
    firebase
    .auth()
    .signOut()
    .then(function(result) {
        App.showAlert("Successfully signed out.", "")
    })
}