$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA0AFyAu1sAmgGLw7gNTsYpAHK0H10JaB8",
    authDomain: "homework-week7.firebaseapp.com",
    databaseURL: "https://homework-week7.firebaseio.com",
    projectId: "homework-week7",
    storageBucket: "homework-week7.appspot.com",
    messagingSenderId: "927056711384"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName;
var destination;
var firstTrainTime;
var frequency;
var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
var nextTrainTime;


// Capture Button Click
$("#train-form").on("submit", function (event) {
    // Don't refresh the page!
    event.preventDefault();

    trainName = $("#add-train").val().trim();
    destination = $("#train-destination").val().trim();
    firstTrainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();
    
    // YOUR TASK!!!
    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,

    });
});

database.ref().on("child_added", function (snapshot) {

    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequency);

    var tFrequency = snapshot.val().frequency;

    // Time is 3:30 AM
    var firstTime = snapshot.val().firstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    // Change the HTML to reflect
    $("#add-train").text(snapshot.val().trainName);
    $("#train-destination").text(snapshot.val().destination);
    $("#frequency").text(snapshot.val().frequency);
    $("#nextTrain").text(snapshot.val().nexTrain);
    $("#minutesTillTrain").text(snapshot.val().tMinutesTillTrain);
    


    // Get reference to existing tbody element, create a new table row element
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var trainName = $("<td>").append(snapshot.val().trainName);
    var destination = $("<td>").append(snapshot.val().destination);
    var frequency = $("<td>").append(snapshot.val().frequency);
    var nextTrain = $("<td>").text(nextTrain.format("hh:mm"));
    var tMinutesTillTrain = $("<td>").text(tMinutesTillTrain);
    

    // Append the newly created table data to the table row
    tRow.append(trainName, destination, frequency, nextTrain, tMinutesTillTrain);
    // Append the table row to the table body
    tBody.append(tRow);
    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
});
