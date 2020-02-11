var auth2, isLoggedIn, profile;

function onLoadCallback() {
  auth2 = gapi.auth2.getAuthInstance();
}

window.setTimeout(function() {
  if (isLoggedIn) {
    return;
  }
  $("#login").show();
  $(".out").show();  
  $(".in").hide();  
}, 1000)

function onSignIn() {
  $("#login").show();
  $(".out").hide();
  $(".in").show();
  isLoggedIn = true;
  profile = auth2.currentUser.get().getBasicProfile();
  $("#fullname").text(profile.getName())
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    username = "";
    location.reload(); 
  });
}

const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');


const chars = '.$[]#/%'.split('');
const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

const charToCode = {};
const codeToChar = {};
chars.forEach((c, i) => {
  charToCode[c] = charCodes[i];
  codeToChar[charCodes[i]] = c;
});

const charsRegex = new RegExp(`[${escapeRegExp(chars.join(''))}]`, 'g');
const charCodesRegex = new RegExp(charCodes.join('|'), 'g');

const encode = (str) => str.replace(charsRegex, (match) => charToCode[match]);
const decode = (str) => str.replace(charCodesRegex, (match) => codeToChar[match]);