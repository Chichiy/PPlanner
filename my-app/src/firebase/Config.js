import firebase from "firebase/app"
import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import { addCard } from "../pages/Project/feature/CardBoard/cardSlice"

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

export const toDate = firebase.firestore.Timestamp.toDate

//////listening to cloud data///////
export const listenToProjects = (
  userId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  db.collection("projects")
    .where("members", "array-contains", userId)
    .onSnapshot(function (snapshot) {
      let temp = []
      snapshot.docChanges().forEach(function (change) {
        let changes = change.doc.data()
        if (change.type === "added") {
          // console.log("add ", changes, "to local state")
          handleAdd(changes)
        }
        if (change.type === "modified") {
          handleModify(changes)
          console.log("modify ", changes, "to local state")
        }
        if (change.type === "removed") {
          handleRemove(changes)
          console.log("Removed: ", changes, "from local state")
        }
        temp.push(changes)
      })
    })
}

export const listenToDayplans = (
  itineraryId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  db.collection("dayplans")
    .where("itinerary_id", "==", itineraryId)
    .onSnapshot(function (snapshot) {
      let temp = []
      snapshot.docChanges().forEach(function (change) {
        let changes = change.doc.data()
        if (change.type === "added") {
          // console.log("add ", changes, "to local state")
          handleAdd(changes)
        }
        if (change.type === "modified") {
          handleModify(changes)
          console.log("modify ", changes, "to local state")
        }
        if (change.type === "removed") {
          handleRemove(changes)
          console.log("Removed: ", changes, "from local state")
        }
        temp.push(changes)
      })
    })
}

export const listenToCard = (
  projectId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  db.collection("projects")
    .doc(projectId)
    .collection("cards")
    .onSnapshot(function (snapshot) {
      let temp = []
      snapshot.docChanges().forEach(function (change) {
        let changes = change.doc.data()
        if (change.type === "added") {
          handleAdd(changes)
          // console.log("add ", changes, "to local state")
        }
        if (change.type === "modified") {
          handleModify(changes)
          console.log("modify ", changes, "to local state")
        }
        if (change.type === "removed") {
          handleRemove(changes)
          console.log("Removed: ", changes, "from local state")
        }
        temp.push(changes)
      })
    })
}

//////update cloud data//////

//basic function
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

//update project title in nav bar
export const updateProjectTitle_Fs = (projectId, input) => {
  let docRef = db.collection("projects").doc(projectId)
  let changes = {
    title: input,
  }
  return docRef
    .update(changes)
    .then(function () {
      console.log("Document successfully updated project title!")
    })
    .catch(function (error) {
      console.error("Error updating document: ", error)
    })
}

export const AddCard_Fs = (projectId, input) => {
  let docRef = db.collection("projects").doc(projectId).collection("cards")

  return docRef
    .add(input)
    .then(function (newCard) {
      newCard.update({
        id: newCard.id,
      })
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
    })
}

//////initialize local data//////

export function getFsData_Projects(userId, field, operators, value) {
  return db
    .collection("projects")
    .where("members", "array-contains", userId)
    .get()
    .then(function (querySnapshot) {
      let temp = []
      querySnapshot.forEach(function (doc) {
        temp.push(doc.data())
      })
      return temp
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
}

export function getFsData_Itinerary(project_id, field, operators, value) {
  return db
    .collection("projects")
    .doc(project_id)
    .collection("itineraries")
    .orderBy("created_time", "desc") //get the latest version of itineray
    .limit(1)
    .get()
    .then(function (querySnapshot) {
      let temp
      querySnapshot.forEach(function (doc) {
        temp = doc.data()
      })
      return temp
    })
    .then((res) => {
      //conver time object to string
      res.created_time = res.created_time.toDate().toString()
      return res
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
}

export function getFsData_Cards(project_id, field, operators, value) {
  return db
    .collection("projects")
    .doc(project_id)
    .collection("cards")
    .get()
    .then(function (querySnapshot) {
      // let sigle,
      //   counter = 0
      let multi = []

      querySnapshot.forEach(function (doc, index) {
        // let sigle = doc.data()
        multi.push(doc.data())
        // counter++
      })

      // if (counter === 1) return sigle

      return multi
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error)
    })
}

//////basic functions//////
export function getFsData(collection, field, operators, value) {
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

export function getFsData2(collection, field, operators, value) {
  db.collection(collection)
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

//not sure what to do

export const listenToData = (callback) => {
  db.collection("test")
    .doc("2eddU3pn48Llu7Ji60Nz")
    .onSnapshot(function (doc) {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server"
      let data = doc.data()
      callback(data)
    })
}

export const updateCards = (projectId, cardId, changes) => {
  let docRef = db
    .collection("project")
    .doc(projectId)
    .collection("cards")
    .doc(cardId)

  return (
    docRef
      .update(changes)
      .then(function () {
        console.log("Document successfully updated!")
      })
      // .then(docRef.update({ onChange: "" }))
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error)
      })
  )
}

export const updateSchedule = (dayplanId, changes) => {
  let docRef = db.collection("dayplans").doc(dayplanId)

  return (
    docRef
      .update({ schedule: changes })
      .then(function () {
        console.log("Document successfully updated!")
      })
      // .then(docRef.update({ onChange: "" }))
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error)
      })
  )
}
