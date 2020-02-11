function parseSnapshot(snapshot, action) {
  let key_split = snapshot.key.split("_");
  let child = snapshot.val();
  let values = {
    exercise: key_split[0],
    question: key_split[1],
    choice: child.choice,
    code: child.code,
    isCorrect: action == "remove" ? 0 : child.isCorrect,
    hint: child.hint
  }
  update_problem(values.exercise, values.question, values.choice,
      values.code, values.isCorrect, values.hint, action);
}

var api = {
  init: function() {
    let checkin = {};
    checkin[username] = Date.now();
    firebase
      .database()
      .ref('checkin/' + course_tag)
      .update(checkin);
    let dbRef = firebase.database().ref('responses/' + course_tag + '/' + username);
    dbRef.on('child_added', function(snapshot) {
      parseSnapshot(snapshot, "add");
    })
    dbRef.on('child_changed', function(snapshot) {
      parseSnapshot(snapshot, "change");
    })
    dbRef.on('child_removed', function(snapshot) {
      parseSnapshot(snapshot, "remove");
    })
  },
  uploadMultipleChoice: function(exercise, question, choice, isCorrect) {
    question_data = {
      choice: choice,
      isCorrect: isCorrect ? 1 : -1,
    }
    if (!isCorrect) {
      question_data.wasCorrect = false
    }
    firebase
      .database()
      .ref('responses/' + course_tag + '/' + username + '/' + exercise + '_' +
          question)
      .update(question_data);
  },
  uploadCode: function(exercise, question, code, isCorrect) {
    isCorrect = isCorrect || 0;
    question_data = {
      isCorrect: isCorrect,
      code: code
    }
    firebase
      .database()
      .ref('responses/' + course_tag + '/' + username + '/' + exercise + '_' +
          question)
      .update(question_data);
  },
  uploadTodo: function(exercise, question) {
    firebase
      .database()
      .ref('responses/' + course_tag + '/' + username + '/' + exercise + '_' +
          question)
      .update({isCorrect : 1});
  }

}
