// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
// Instantiates a client
const vision = Vision();

const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

//initialize return array
var labelArray = [];

//initialize our description
var description = null;

exports.newPhoto = functions.storage.object().onChange(event => {

  const bucketName = [YOUR BUCKET NAME HERE] ex:'gs://HOTDOGAPP.appspot.com';
  const fileName = 'images/maybeHotDog.jpg';

  // get file name for image and place in request
  const bucket = gcs.bucket(bucketName);
  const tempFilePath = path.join('tmp/', fileName);
  const gcsPath = `${bucketName}/${fileName}`;
  const request = {
    source: {
      imageUri: gcsPath
    }
  };

  //send vision API our request
  vision.labelDetection(request)
    .then((results) => {
      //get the labels
      const labels = results[0].labelAnnotations;
      //most likely is the first label
      description = labels[0].description;

      console.log('most likely ' + description);
      //initialize the DB reference
      var db = admin.database();
      var ref = db.ref("hotdog");

      labels.forEach((label) => console.log(label));

      labels.forEach((label) => {
        if(label == "hot dog")
          description = label;
        });
      if (description != "hot dog")
        description = "not hot dog"
      //set value of what the image most likely is in DB
      ref.set(description);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });

 });
