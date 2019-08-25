require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
//var key = require("/keys.js")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "CodingPants007!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT item_id,product_name,price FROM products", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

    });


    productRequest();
});

function productRequest() {
    inquirer.prompt([
        {
            name: "id",
            message: "Enter the id of the product you choose.",
            type: "number"
        },
        {
            name: "order",
            message: "How many would you like?",
            type: "number",
            validate: function (num) {
                if (num < 1) {
                    return "Input a correct quantity.";
                }
                else return true;
            }
        }
    ]).then(function (response) {
        connection.query(
            "SELECT * FROM products WHERE item_id = ?", [response.id],
            function (err, result) {
                if (err) throw err; { }

                if (result[0].stock_quantity < response.order) {
                    console.log("That is currently out of stock, sorry.");

                    anotherOne();
                } else {
                    connection.query(
                        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [response.order, response.id],
                        function (err) {
                            if (err) throw err;
                            console.log("\n Thank you for shopping at Bamazon!\nYour total is $" + response.order * response[0].price)
                        }
                    );
                    anotherOne();
                }

            }


        )
    });
}

function anotherOne() {
    inquirer.prompt(
        {
            name: "another",
            message: "Would you like to go again?",
            type: "confirm"
        }
    ).then(function (response) {
        if (response.another) {
            console.log("\n")
            productRequest();
        }
        else connection.end();
    })
}