import firebase from "firebase/app"
import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import { doc } from "prettier"

const firebaseConfig = {
  apiKey: "AIzaSyAxbnsUNTG2SYqUsC2QqIbBo1OLuKXeZ-g",
  authDomain: "pplanner-bfb1a.firebaseapp.com",
  databaseURL: "https://pplanner-bfb1a.firebaseio.com",
  projectId: "pplanner-bfb1a",
  storageBucket: "pplanner-bfb1a.appspot.com",
  messagingSenderId: "501383303118",
  appId: "1:501383303118:web:a6c81e2be82826845e659f",
  measurementId: "G-FETYRNE2VX",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

//abbreviation
var db = firebase.firestore()
const defaultID = "aJyjoGPEIH69isQ7QfYs"

//////library//////

export const update = (collection, doc, fileds) => {
  let docRef = db.collection(collection).doc(doc)

  return docRef
    .update(fileds)
    .then(function () {
      console.log("Document successfully updated!")
    })
    .then(docRef.update({ onChange: "" }))
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error)
    })
}

export const listenToData = (callback) => {
  db.collection("test")
    .doc("2eddU3pn48Llu7Ji60Nz")
    .onSnapshot(function (doc) {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server"
      let data = doc.data()
      callback(data)
    })
}

export const test = () => {
  getUserInfo("test").then(p)
}

export const getUserInfo = (email) => {
  return searchInDb("users", "email", "==", email).then((user) => {
    return user
  })
}

//////basic functions//////
function searchInDb(collection, field, operators, value) {
  return db
    .collection(collection)
    .where(field, operators, value)
    .get()
    .then(function (querySnapshot) {
      let sigle,
        counter = 0
      let multi = []

      querySnapshot.forEach(function (doc, index) {
        sigle = doc.data()
        multi.push(doc.data())
        counter++
      })

      if (counter === 1) return sigle

      return multi
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
}

function p(input) {
  console.log(input)
}
