import * as Model from "../model/model.js";


$(document).ready(function() {
    Model.initFirebase(displayHomeContent);
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
        Model.getAllJokes(displayHomeContent);
        closeNavMenu();
    });
    $("#signIn").click(function() {
        displaySignInContent();
        closeNavMenu();
    });
}

export function displayHomeContent(jokesData) {

    $("#page-title").html("Browse Jokes");
    $("#site-content").html(`
        <div id="home-content"></div>
        <div class="filter-btn-container hidden">
          <div class="filter-btn">
            FILTER JOKES
          </div>
        </div>
    `);

    jokesData.forEach(function(doc) {

        let joke = doc.data();
        console.log(joke);

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
                        by <div class='user-link' id='${joke.uid}'>${joke.user}
                        <img src='https://firebasestorage.googleapis.com/v0/b/n423-data-dc.appspot.com/o/1606771207844-miles_sandals.png?alt=media&token=35c080cc-4073-4bc4-be41-a0711b8cb331' class='user-img'>
                        </div>
                    </div>
                </div>
            </div>
        `);

        Model.checkForLol(doc.id);
    });

    //after all the cards are displayed, init the card listeners
    initCardListeners();
        
}

export function displayUserPageContent(jokesData, userId) {
    $("#page-title").html(`${jokesData.docs[0].data().user}'s Jokes`);

    $("#site-content").html(`
        <div id="my-jokes-content"></div>
    `);

    // if it's current user's page show 'add joke' button ////
    if (Model.checkUserForMatch(userId)) {
        $("#site-content").append(`<div id="add-joke"><i class="fas fa-plus-circle"></i></div>`);

        $("#add-joke").click(() => {
            displayCreateJokeContent();
        })
    }

    if (jokesData.docs.length > 0) {
        jokesData.forEach(function(doc) {

            let joke = doc.data();
            
            let lolCount = joke.lols.length;
            // console.log(lolCount);

            $("#my-jokes-content").append(`
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

            Model.checkForLol(doc.id);
        });

        //after all the cards are displayed, init the card listeners
        initCardListeners();
    }
    else {
        console.log(jokesData);
        $("#my-jokes-content").append(`
            <br>
            <h3>You haven't added any jokes yet.</h3>
            <br>
            <img style='border-radius: 8px' src='images/jokeless_in_seattle.gif' />
        `);
    }
}

export function initCardListeners() {
    $(".lol-div").click(function(e) {
        let card_id = this.id;
        console.log("card clicked", card_id);
        Model.toggleLol(card_id);
    });
    $(".user-link").click((e) => {
        // console.log(e.target.id);
        Model.getJokesByUserId(displayUserPageContent, e.target.id);
    })
}



// functions to display page content

export function closeNavMenu() {
    $(".nav-links").addClass("hidden");
}


export function displaySignInContent() {

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
                
                <div id="sign-in-submit" class="submit-btn">Sign In</div>

                <p>
                    Don't have an account?
                    <br/>
                    <span id="sign-up">Sign Up</span> instead.
                </p> 
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

export function setSignInOut(data) {
    if (data == 'SignedIn') {
        //display the link to 'my jokes' page
        $('#myJokes').removeClass('hidden');
        //create listener for 'my jokes' link
        $("#myJokes").click(function() {
            console.log("my jokes clicked")
            Model.getJokesByUserId(displayUserPageContent);
            closeNavMenu();
        });

        //turn off listeners for both sign in & sign out links
        $('#signIn').off();
        $('#signOut').off();
        //populate div with 'sign out' link
        $("#signInOut").html(`<div id="signOut" class="nav-link user-div">Sign Out</div>`);
        //create new listener for sign out div
        $('#signOut').click(function() {
            Model.signOut();
            closeNavMenu();
        })
    }
    else if (data == 'SignedOut') {
        //hide the link to 'my jokes' page
        $('#myJokes').addClass('hidden');
        //remove listener for 'my jokes' link
        $("#myJokes").off();

        //turn off listeners for both sign in & sign out links
        $('#signIn').off();
        $('#signOut').off();
        //populate div with 'sign in' link
        $("#signInOut").html(`<div id="signIn" class="nav-link user-div">Sign In</div>`);
        //create new listener for sign in div
        $("#signIn").click(function() {
            displaySignInContent();
            closeNavMenu();
        });
    }
}

export function displayCreateJokeContent() {

    $('#page-title').html('Make Us &nbsp;\'<span class="lol-text">LOL</span>\'');

    $('#site-content').html(`
        <div id="new-joke-content">

            <h2>Joke Category:</h2>
            <div class='new-joke-row'>
                <select name="joke-category" id="joke-category">
                <option value="puns">Puns</option>
                <option value="dad-jokes">Dad Jokes</option>
                <option value="knock-knock">Knock Knock</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
            </div>

           

              <h2>Setup</h2>
              <div class='new-joke-row'>
                    <textarea name="joke-setup" id="joke-setup" placeholder="Your Joke's Setup"></textarea>
                </div>

              <h2>Punchline</h2>
              <div class='new-joke-row'>
                <textarea name="joke-punchline" id="joke-punchline" placeholder="Your Joke's Punchline"></textarea>
              </div>
              
            <h2>Joke Privacy</h2>
            <div class='new-joke-row'>
                
                
                <input type="radio" id="joke-public" name="joke-public-private" value="true" checked>
                <label for="public">Public</label><br>

                <input type="radio" id="private" name="joke-public-private" value="false">
                <label for="private">Private</label><br>
            </div>

            <h2>Personal Rating</h2>
            <div class='new-joke-row'>
                <select name="joke-rating" id="joke-rating">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                </select>
            </div>

            <div class='submit-btn' id='submit-new-joke'>Submit</div>

        </div>
    `);



    $('#submit-new-joke').click(() => {
        //collect the data from the form
        let jokeCategory = $('#joke-category').val();
        let jokeSetup = $('#joke-setup').val();
        let jokePunchline = $('#joke-punchline').val();
        let jokePublic = $('input[name="joke-public-private"]:checked').val();
        let jokeRating = $('#joke-rating').val();


        let jokeData = {
            category: jokeCategory,
            content: {
                setup: jokeSetup,
                punchline: jokePunchline
            },
            lols: [],
            public: jokePublic,
            rating: jokeRating,
            uid: '',
            user: ''
        }


        //create the joke and then display current user's jokes
        Model.createNewJoke(jokeData, displayUserPageContent);
    });
    
}

