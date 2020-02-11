var master_seed = Math.floor(1000 * Math.random())
var old_data = {}
var new_data = {}
function error(e) {
  if (e) {
    $(".error").text(e)
    $(".output").css('opacity', '0.5')
  } else {
    $(".error").html("&nbsp")
    $(".output").css("opacity", "1")
  }
}
function loadProblem(problem_number) {
  seed = master_seed + problem_number
  var content =  renderToString(problem_number-1, new_data[problem_number])
  var target = $(`.problem[num="${problem_number}"]`)
  if (target.get(0)) {
    target.html(content)
    // console.log("updated " + problem_number);
  } else {
    $(".output").append(`<div class='problem' num="${problem_number}">${content}</div>`);
    // console.log("added " + problem_number);
  }
}
function loadYAML(data) {
  try {
    new_data = parseYAML(data)
  } catch(e) {
    error(e)
    return
  }
  error(false)
  var change_answer = false
  if (!_.isEqual(old_data, new_data)) {
    var problem_numbers = Object.keys(new_data).map(x => parseInt(x) || x).sort()
    var old_problem_numbers = Object.keys(old_data).map(x => parseInt(x) || x).sort()
    for (var i = 0; i < old_problem_numbers.length; i++) {
      var problem_number = old_problem_numbers[i]
      if (problem_numbers.indexOf(problem_number) < 0) {
        $(`.problem[num="${problem_number}"]`).remove();
        // console.log("removed " + problem_number);
      } else {
        if (!_.isEqual(new_data[problem_number], old_data[problem_number])) {
          change_answer = true
          try {
            loadProblem(problem_number)
          } catch (e) {
            error(e)
          }
        }
      }
    }
    for (var i = 0; i < problem_numbers.length; i++) {
      var problem_number = problem_numbers[i]
      if (old_problem_numbers.indexOf(problem_number) < 0) {
        change_answer = true
        try {
          loadProblem(problem_number)
        } catch(e) {
          error(e)
        }
      }
    }
  }
  old_data = new_data;
  if (change_answer) {
    $(".choice").removeClass("blue")
    $(".choice.correct").addClass("blue")
  }
}
$('textarea').bind('input propertychange', function() {
  data = this.value;
  loadYAML(data)
});
$(".copy").click(function(){
  alert("Copied to clipboard.")
  $(".input").select();
  document.execCommand('copy');
  $(".input").blur();
});
controlCapture("s", function() {
  $(".copy").click()
})
$.get("data/questions.yaml", function(data) {
  $("textarea").text(data);
  loadYAML(data)
});
$(".input").bind("keydown click focus", function() {
  var lines = this.value.substr(0, this.selectionStart).split("\n")
  for (var i = lines.length - 1; i >= 0; i--) {
    var start_regex = /^([0-9]+):/
    var matches = lines[i].match(start_regex)
    if (matches) {
      var num = matches[1]
      var target = $(`.problem[num=${num}]`)
      if (target.get(0)) {
        $('.output').scrollTop($('.output').scrollTop() + target.position().top - $('.output').position().top)
      }
      break;
    }
  }
});
autoIndent("textarea");
