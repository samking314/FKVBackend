# Firebase + Kotlin + Vision API Backend


Functions used are located in the index.js file under the functions folder.

Current functions used for FKV include:

- NewPhoto()
  - this detects when a new photo has been uploaded to the Firebase storage service
  - then it calls the vision function to handle the photo request
  - the vision function then updates the Firebase DB with the label for the photo
