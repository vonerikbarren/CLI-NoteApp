var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "NotesApp_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "NoteMake",
      type: "list",
      message: "Would you like to [MAKE] a note or [DELETE] a note?",
      choices: ["MAKE", "READ", "UPDATE", "DELETE", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.NoteMake === "MAKE") {
        postNote();
      }
      else if (answer.NoteMake === "DELETE") {
        deleteNote();
      } else if (answer.NoteMake === "READ") {
        readNote();
      } else if (answer.NoteMake === "UPDATE") {
        updateNote();
      } else {
        connection.end();
      }
    });
}


function postNote() {
  inquirer.prompt([
    {
      name: "itemTitle",
      type: "input",
      message: "What is the title of the note you would like to submit?"
    },
    {
      name: "itemPriority",
      type: "list",
      message: "What is the priority of this note?",
      choices: ["NOT IMPORTANT", "IMPORTANT", "VERY IMPORTANT"]
    },
    {
      name: "itemCategory",
      type: "list",
      message: "What category does this note belong to sir,",
      choices: ["LIFE", "FINANCES", "PERSONAL", "EDUCATIONAL", "PROJECT", "PROFESSIONAL"]
    },
    {
      name: "itemNote",
      type: "input",
      message: "What is the content of the note you would like to submit?"
    },

  ]).then(function (answer) {

    // when finished prompting, insert a new item into the db with that info
    connection.query(
      "INSERT INTO NotesTable SET ?",
      {
        item_title: answer.itemTitle,
        item_priority: answer.itemPriority,
        category: answer.itemCategory,
        item_note: answer.itemNote
      },
      function (err) {
        if (err) throw err;
        console.log("\n");
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
        console.log("Your note was created successfully sir!");
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
        // re-prompt the user for if they want to bid or post
        start();
      }
    );

  });
}


function readNote() {
  inquirer.prompt([
    {
      name: "readOptions",
      type: "list",
      message: "What would you like to do?",
      choices: ["ALL NOTES", "A NOTE", "MAIN MENU"]
    },
    {
      name: "areYouSure",
      type: "confirm",
      message: "Are you Sure?",

    },


  ]).then(function (answer) {

    if (answer.readOptions === "ALL NOTES") {
      function readNotes() {
        console.log("\n Selecting all Notes...\n");
        connection.query("SELECT * FROM NotesTable", function (err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(res);
          console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= \n");
          start();
        });
      }
      readNotes();
      console.log("\n -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");




    } else console.log("Sir, something went wrong, Im afraid");

  });

}


function updateNote() {
  if (answer.NoteMake === "UPDATE") {
    function updateProduct() {
      console.log("Updating all Rocky Road quantities...\n");
      var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            quantity: 100
          },
          {
            flavor: "Rocky Road"
          }
        ],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
          // Call deleteProduct AFTER the UPDATE completes
          deleteProduct();
        }
      );

      // logs the actual query being run
      console.log(query.sql);
    }
  }
}

