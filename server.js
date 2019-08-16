// Create express app
var express = require("express")
var app = express()

// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// Insert here other API endpoints

var http = require('http');

// POST for create a new pet in the DB
const cors = require('cors');
app.post("/updateMascota/:name", cors(), (req, res, next) => {
    console.log("------------------------------------------------------------------------------------------");
    console.log(req.body);
    console.log(req.body.nombre);
    console.log(req.body.especie);
    console.log(req.body.propietario);
    console.log(req.body.raza);
    console.log(req.body.sexo);

    var username = 'admin';
    var password = 'practica';
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    var body = "<Mascota><nombre>" + req.body.nombre + "</nombre><propietario>" +
        req.body.propietario + "</propietario><especie>" + req.body.especie +
        "</especie><raza>" + req.body.raza + "</raza><sexo>" + req.body.sexo + "</sexo></Mascota>";
    var options = {
        host: 'localhost',
        port: '8080',
        path: '/exist/rest/db/apps/XMLearn/Mascotas/' + req.params.name + ".xml",
        method: "PUT",
        headers: {
            'Content-Type': 'text/xml',
            "Authorization": auth,
            "Content-Length": body.length
        }
    };

    var pet = http.request(options, function (res3) {
        console.log('STATUS: ' + res3.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res3.headers));
        res.status(res3.statusCode).send({ 'status': res3.statusCode });
        res3.setEncoding('utf8');
        res3.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    pet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    pet.write(body);
    pet.end();

});


app.post("/signin", cors(), (req, res, next) => {

    var username = 'admin';
    var password = 'practica';
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    var body = "<user><name>" + req.body.name + "</name><password>" +
        req.body.password + "</password><userid>" + "3" + "</userid><email>" + req.body.email +
        "</email></user>";
    var options = {
        host: 'localhost',
        port: '8080',
        path: '/exist/rest/db/apps/XMLearn/Users/' + req.body.name + '.xml',
        method: "PUT",
        headers: {
            'Content-Type': 'text/xml',
            "Authorization": auth,
            "Content-Length": body.length
        }
    };

    var pet = http.request(options, function (res3) {
        console.log('STATUS: ' + res3.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res3.headers));
        res.status(res3.statusCode).send({ 'status': res3.statusCode });
        res3.setEncoding('utf8');
        res3.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    pet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    pet.write(body);
    pet.end();

});




var xpath = require('xpath')
    , dom = require('xmldom').DOMParser;
// const { body, validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
app.post("/login", cors(), (req, res, next) => {

    var username = 'admin';
    var password = 'practica';
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    var options = {
        host: 'localhost',
        port: '8080',
        path: '/exist/rest/db/apps/XMLearn/Users/users.xml',
        method: "GET",
        headers: {
            'Content-Type': 'text/xml',
            "Authorization": auth
        }
    };

    // body('username', 'Empty name').matches(/^\=/);
    // (req, res, next) => {
    //     // Extract the validation errors from a request.
    //     const errors = validationResult(req);

    //     if (!errors.isEmpty()) {
    //         return res.status(422);
    //     }
    //     else {
    //         // Data from form is valid.
    //     }
    // }

    var pet = http.request(options, function (res3) {
        console.log('STATUS: ' + res3.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res3.headers));
        res.status(res3.statusCode).send({ 'status': res3.statusCode });
        res3.setEncoding('utf8');
        res3.on('data', function (chunk) {
            var doc = new dom().parseFromString(chunk);
            var result = xpath.evaluate(
                "/users/user[username='" + req.body.username + "' and password='" + req.body.password + "']",            // xpathExpression
                doc,                        // contextNode
                null,                       // namespaceResolver
                xpath.XPathResult.ANY_TYPE, // resultType
                null                        // result
            )

            node = result.iterateNext();
            while (node) {
                console.log(node.localName + ": " + node.firstChild.data);
                console.log("Node: " + node.toString());

                node = result.iterateNext();
            }
            // console.log('BODY: ' + chunk);
        });
    });

    pet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body

    pet.end();

});


// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});