var database = firebase.database();
var query = window.location.search.substring(1);
var qs = parseQueryString(query);
var course = qs["course"] || "basic_html";
var lesson = qs["lesson"] || 1;
var course_tag = course + "_" + lesson;

firebase
  .database()
  .ref('checkin/' + course_tag).on('child_added', function(snapshot) {
    $("#students").prepend(`
      <button class="ui button basic">${decode(snapshot.key)}</button>
    `);
  })

$("#students").on('click', 'button', function() {
  $("#students > button").removeClass("teal");
  $(this).addClass("teal");
  let username = encode($(this).text());
  $("iframe").attr("src", "viewer.html?" + query + "&adminview=" + username);
});