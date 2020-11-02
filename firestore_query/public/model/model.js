var _db;

export function initFirebase(callback) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("There is a user");
        } else {
            console.log("No user");
            _db = "";
        }

        callback();
    });
}

export function signIn(callback) {
    firebase
    .auth()
    .signInAnonymously()
    .then(function(result) {
        _db = firebase.firestore();
        callback()
    })
}

export function getAlbumsByGenre(genre) {
    if (genre == "All Albums") {
    _db
    .collection("Albums")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let album = doc.data();
            $(".albums-content").append(`
                <div class="album-card">
                    <div class="album-info">
                        <span class="genre-info">${album.genre}</span>
                        <p class="artist-info">${album.artist}</p>
                        <p class="album-name"><strong>${album.name}</strong></p>
                        
                    </div>
                    <img src="${album.photo}" height="50%" style="border-radius: 20px"/>
                </div>
            `);
        })
    })
    }

    $(".genre-content").html(genre);
    // $(".content").append(`<h3>${genre}</h3>`);
    $(".albums-content").html("");

    _db
    .collection("Albums")
    .where("genre", "==", genre)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let album = doc.data();
            $(".albums-content").append(`
                <div class="album-card">
                    <div class="album-info">
                        <span class="genre-info">${album.genre}</span>
                        <p class="artist-info">${album.artist}</p>
                        <p class="album-name"><strong>${album.name}</strong></p>
                        
                    </div>
                    <img src="${album.photo}" height="50%" style="border-radius: 20px"/>
                </div>
            `);
        })
    })
}