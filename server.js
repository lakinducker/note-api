// call the packages we need
var express    = require('express');        // call express
var cors       = require('cors');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use cors
app.use(cors());


var mongoose   = require('mongoose');
var db;
db = mongoose.connect('mongodb://localhost/note');

var Note     = require('./app/models/note');



var port = process.env.PORT || 8080;        // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /notes
// ----------------------------------------------------
router.route('/notes')

    // create a note (accessed at POST http://localhost:8080/api/notes)
    .post(function(req, res) {

        var note = new Note();      // create a new instance of the Note model
        note.title = req.body.title;  // set the notes title (comes from the request)
        note.noteContent = req.body.noteContent;  // set the notes noteContent (comes from the request)
        note.date = req.body.date;  // set the notes date (comes from the request)
        note.author = req.body.author;  // set the notes author (comes from the request)

        // save the note and check for errors
        note.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Note created!' });
        });

    })

    // get all the notes (accessed at GET http://localhost:8080/api/notes)
    .get(function(req, res) {
        Note.find(function(err, notes) {
            if (err)
                res.send(err);

            res.json(notes);
        });
    });

// on routes that end in /notes/:_id
// ----------------------------------------------------
router.route('/notes/:_id')

    // get the note with that id (accessed at GET http://localhost:8080/api/notes/:_id)
    .get(function(req, res) {
        Note.findById(req.params._id, function(err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    })

    // update the note with this id (accessed at PUT http://localhost:8080/api/notes/:_id)
    .put(function(req, res) {

        // use our note model to find the note we want
        Note.findById(req.params._id, function(err, note) {

            if (err)
                res.send(err);

            note.title = req.body.title;  // set the notes title (comes from the request)
            note.noteContent = req.body.noteContent;  // set the notes noteContent (comes from the request)
            note.date = req.body.date;  // set the notes date (comes from the request)
            note.author = req.body.author;  // set the notes author (comes from the request)

            // save the note
            note.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Note updated!' });
            });

        });
    })

    // delete the note with this id (accessed at DELETE http://localhost:8080/api/notes/:_id)
    .delete(function(req, res) {
        Note.remove({
            _id: req.params._id
        }, function(err, note) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted ' + req.params._id});
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);