var dataJWT = "";

//////////////////////////////////////////////////////////////////////
// OAUTH REQUEST

// Initiate the PKCE Auth Code flow when the link is clicked
document.getElementById("start").addEventListener("click", async function(e){
    e.preventDefault();
    
    // Create and store a random "state" value
    var state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    var code_verifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", code_verifier);

    // Hash and base64-urlencode the secret to use as the challenge
    var code_challenge = await pkceChallengeFromVerifier(code_verifier);

    // Build the authorization URL
    var url = config.authorization_endpoint 
        + "?response_type=code"
        + "&client_id="+encodeURIComponent(config.client_id)
        + "&state="+encodeURIComponent(state)
        + "&scope="+encodeURIComponent(config.requested_scopes)
        + "&redirect_uri="+encodeURIComponent(config.redirect_uri)
        + "&code_challenge="+encodeURIComponent(code_challenge)
        + "&code_challenge_method=S256"
        ;

    // Redirect to the authorization server
    window.location = url;
});


//////////////////////////////////////////////////////////////////////
// OAUTH REDIRECT HANDLING

// Handle the redirect back from the authorization server and
// get an access token from the token endpoint

var q = parseQueryString(window.location.search.substring(1));

// Check if the server returned an error string
if(q.error) {
    alert("Error returned from authorization server: "+q.error);
    document.getElementById("error_details").innerText = q.error+"\n\n"+q.error_description;
    document.getElementById("error").classList = "";
}

// If the server returned an authorization code, attempt to exchange it for an access token
if(q.code) {

    // Verify state matches what we set at the beginning
    if(localStorage.getItem("pkce_state") != q.state) {
        alert("Invalid state");
    } else {

        // Exchange the authorization code for an access token
        sendPostRequest(config.token_endpoint, {
            grant_type: "authorization_code",
            code: q.code,
            client_id: config.client_id,
            redirect_uri: config.redirect_uri,
            code_verifier: localStorage.getItem("pkce_code_verifier")
        }, function(request, body) {

            // Initialize your application now that you have an access token.
            // Here we just display it in the browser.
            //document.getElementById("access_token").innerText = body.access_token;
            document.getElementById("id_token").innerText = body.id_token;
            document.getElementById("start").classList = "hidden";
            document.getElementById("token").classList = "";             
            dataJWT = body.id_token;
            // Replace the history entry to remove the auth code from the browser address bar
            window.history.replaceState({}, null, "/projetJ/index.html");

        }, function(request, error) {
            // This could be an error response from the OAuth server, or an error because the 
            // request failed such as if the OAuth server doesn't allow CORS requests
            document.getElementById("error_details").innerText = error.error+"\n\n"+error.error_description;
            document.getElementById("error").classList = "";
        });
    }

    // Clean these up since we don't need them anymore
    localStorage.removeItem("pkce_state");
    localStorage.removeItem("pkce_code_verifier");
}


    //////////////////////////////////////////////////////////////////////
    // GENERAL HELPER FUNCTIONS

    // Make a POST request and parse the response as JSON
    function sendPostRequest(url, params, success, error) {
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
            var body = {};
            try {
                body = JSON.parse(request.response);
            } catch(e) {}

            if(request.status == 200) {
                success(request, body);
            } else {
                error(request, body);
            }
        }
        request.onerror = function() {
            error(request, {});
        }
        var body = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        request.send(body);
    }

    // Parse a query string into an object
    function parseQueryString(string) {
        if(string == "") { return {}; }
        var segments = string.split("&").map(s => s.split("=") );
        var queryString = {};
        segments.forEach(s => queryString[s[0]] = s[1]);
        return queryString;
    }

//////////////////////////////////////////////////////////////////////
// PKCE HELPER FUNCTIONS

// Generate a secure random string using the browser crypto functions
function generateRandomString() {
    var array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Calculate the SHA256 hash of the input text. 
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

// Base64-urlencodes the input string
function base64urlencode(str) {
    // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
async function pkceChallengeFromVerifier(v) {
    hashed = await sha256(v);
    return base64urlencode(hashed);
}