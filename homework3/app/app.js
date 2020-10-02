var data = {
  Students: [],
};

function getData() {
  if (!localStorage.getItem("n423_students")) {
    console.log("No Students. Creating students...");
    localStorage.setItem("n423_students", JSON.stringify(data.Students));
  } else {
    data.Students = JSON.parse(localStorage.getItem("n423_students"));
  }
}

function showStudents() {
  let studentsData = JSON.parse(localStorage.getItem("n423_students"));
  if (studentsData.length == 0) {
    $("#alertMessage").html(
      "There are no students to show.<br><br>Please add Students first."
    );
    $("#alertDiv").css("display", "flex");
  }
  $(".studentsInfo").html("");
  console.log(studentsData);

  $.each(studentsData, function (index, value) {
    let studentStr = "";
    studentStr += `
    <div class="studentCard">
      <div class="studentCardInfo">
        <h3>Student Info</h3><br>
        Name | ${value.name}<br>
        Age | ${value.age}<br>
        Phone | ${value.phone}<br>
        Email | ${value.email}
      </div>
      <div class="studentCardClasses">
        <h3>Classes</h3><br>
    `;

    //loop thru classes and add them to div
    $.each(value.classes, function (index, value) {
      studentStr += `${value}<br>`;
    });

    //close the studentCard div
    $(".studentsInfo").append(studentStr + "</div></div>");
  });
}

function checkForm() {
  if (
    $("#studentName").val().length > 0 &&
    $("#studentAge").val().length > 0 &&
    $("#studentPhone").val().length > 0 &&
    $("#studentEmail").val().length > 0 &&
    $(".studentClass")[0].value.length > 0
  ) {
    return true;
  } else {
    $("#alertMessage").html(
      "Error adding student.<br><br>Make sure the form is filled out correctly."
    );
    $("#alertDiv").css("display", "flex");
  }
}

function clearForm() {
  $("input").val("");
}

function addStudent() {
  //set student template
  let newStudent = {
    name: "",
    age: "",
    phone: "",
    email: "",
    classes: [],
  };

  //get student data from form
  if (checkForm()) {
    newStudent.name = $("#studentName").val();
    newStudent.age = $("#studentAge").val();
    newStudent.phone = $("#studentPhone").val();
    newStudent.email = $("#studentEmail").val();

    console.log($(".studentClass"));

    if ($(".studentClass")[0].value.length > 0)
      newStudent.classes.push($(".studentClass")[0].value);
    if ($(".studentClass")[1].value.length > 0)
      newStudent.classes.push($(".studentClass")[1].value);
    if ($(".studentClass")[2].value.length > 0)
      newStudent.classes.push($(".studentClass")[2].value);
    if ($(".studentClass")[3].value.length > 0)
      newStudent.classes.push($(".studentClass")[3].value);
    if ($(".studentClass")[4].value.length > 0)
      newStudent.classes.push($(".studentClass")[4].value);

    //add student to data object
    console.log(data);
    data.Students.push(newStudent);
    //send student to localStorage
    localStorage.setItem("n423_students", JSON.stringify(data.Students));

    $("#alertMessage").html("Student added.");
    $("#alertDiv").css("display", "flex");

    clearForm();
  }
}

function initButtons() {
  $("#addStudent").click(function () {
    addStudent();
  });
  $("#showStudents").click(function () {
    showStudents();
  });
  $("#okBtn").click(function () {
    $("#alertDiv").css("display", "none");
  });
}

getData();
initButtons();
