import * as Model from "../model/model.js";

function displayAlbums() {
    Model.getAlbumsByGenre("All Albums");
}

function initListeners() {
    $("#genres").change(function() {
        Model.getAlbumsByGenre(this.value);
    })
}


$(document).ready(function() {
    Model.initFirebase(displayAlbums);
    Model.signIn(initListeners);
});