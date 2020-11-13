import * as Model from "../model/model.js";


$(document).ready(function() {
    Model.initFirebase();
    initNavMenu();
})

function initNavMenu() {
    $("#nav-menu-btn").click(function(){
        // console.log("nav menu btn clicked");

        if ($(".nav-links").hasClass("hidden")) {
            // console.log("nav is hidden");
            $(".nav-links").removeClass("hidden");
            
        }
        else {
            // console.log("nav is not hidden");
            closeNavMenu()
        }
    });

    $("#home").click(function() {
        console.log("home clicked")
    });
    $("#myJokes").click(function() {
        console.log("my jokes clicked")
    });
    $("#signIn").click(function() {
        displaySignInContent();
        closeNavMenu();
    });
}

export function displayJokes(jokesData) {

    $("#site-content").html(`
        <div id="home-content"></div>
    `);

    jokesData.forEach(function(doc) {

        let joke = doc.data();
        let lolCount = joke.lols.length;
        // console.log(lolCount);

        $("#home-content").append(`
            <div class="joke-div">
                <div class="joke-top">
                    <div class="joke-top-info">
                        <h6>${joke.category}</h6>

                        <div class="lol-div" id="${doc.id}">
                            <span class="lol-num" id="lol-num-${doc.id}">${lolCount}</span>
                            <span class="lol-icon"><i class="fas fa-laugh-squint"></i></span>
                        </div>
                    </div>

                    <h5>${joke.content.setup}</h5>
                    <p>${joke.content.punchline}</p>
                </div>
                <div class="joke-bottom">
                    <div class="user-name">
                        by <strong>${joke.user}</strong>
                    </div>
                </div>
            </div>
        `);

        Model.checkLol(doc.id, "testUser");
    });

        
}

export function initCardListeners() {
    $(".lol-div").click(function(e) {
        let card_id = this.id;
        console.log("card clicked", card_id);
        Model.toggleLol(card_id);
    });
}



// functions to display page content

function closeNavMenu() {
    $(".nav-links").addClass("hidden");
}

function displaySignInContent() {

    $(".filter-btn-container").addClass("hidden");
    $("#page-title").html("Sign In");
    $("#site-content").html(`
        <div id="sign-in-content">
            <div id="sign-in-form">
                <div class="input-row">
                    <h3>Email:</h3>
                    <input id="email" type="text" placeholder="email" />
                </div>
                <div class="input-row">
                    <h3>Password:</h3>
                    <input id="password" type="password" placeholder="password"/>
                </div>
                
                <p>
                    Don't have an account?
                    <br/>
                    <span id="sign-up">Sign Up</span> instead.
                </p> 

                <div id="sign-in-submit" class="submit-btn">Sign In</div>
            </div>
        </div>
    `);

    //listener for sign in submit button
    $("#sign-in-submit").click(function() {
        let email = $("#email").val();
        let password = $("#password").val();
        Model.signIn(email,password);
    });

    //listener to navigate to sign up page
    $("#sign-up").click(function() {
        $("#page-title").html("Sign Up");
        $("#site-content").html(`
            <div id="sign-in-content">
                <div id="sign-up-form">
                    <div class="input-row">
                        <h3>Display Name:</h3>
                        <input id="displayName" type="text" placeholder="display name" />
                    </div>
                    <div class="input-row">
                        <h3>Email:</h3>
                        <input id="email" type="text" placeholder="email" />
                    </div>
                    <div class="input-row">
                        <h3>Password:</h3>
                        <input id="password" type="password" placeholder="password"/>
                    </div>
                    


                    <div id="sign-up-submit" class="submit-btn">Sign Up</div>
                </div>
            </div>
        `);
    
        //listener for sign in submit button
        $("#sign-up-submit").click(function() {
            let email = $("#email").val();
            let password = $("#password").val();
            let displayName = $("#displayName").val();
            Model.signUp(email,password,displayName);
        });

        

    });
}