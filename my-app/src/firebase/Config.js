import firebase from "firebase/app"
import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"

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
var au = firebase.auth()
export const toDate = firebase.firestore.Timestamp.toDate

////////////////////////////////////
//          user-related          //
////////////////////////////////////

export const checkUserStatus = (handleUser, handleNoUser) => {
  au.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      handleUser(user)
    } else {
      // No user is signed in.
      handleNoUser()
    }
  })
}

export const signUp_Native = (input, handleSuccess) => {
  au.createUserWithEmailAndPassword(input.email, input.password)
    .then((result) => {
      let user = result.user
      let docRef = db.collection("users").doc(user.uid)

      let update = {
        name: input.name,
        email: user.email,
        picture: user.photoURL,
      }
      docRef.set(update).catch(function (error) {
        console.error("Error adding document: ", error)
      })
    })
    .then((res) => {
      console.log(res)
      handleSuccess()
    })
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorMessage)
      // ..
    })
}

export const signIn_Native = (input, handleSuccess) => {
  return au
    .signInWithEmailAndPassword(input.email, input.password)
    .then((user) => {
      // Signed in
      // ...
      handleSuccess()
    })
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorMessage)
    })
}

export const signOut = (redirect) => {
  return au
    .signOut()
    .then(function () {
      // Sign-out successful.
      redirect()
    })
    .catch(function (error) {
      // An error happened.
    })
}

export const addProjectInUser_Fs = (userId, change) => {
  let docRef = db.collection("users").doc(userId)
  //expect format
  //change = projectId

  return docRef
    .update({
      projects: firebase.firestore.FieldValue.arrayUnion(change),
    })
    .catch(function (error) {
      console.error("Error updating document: ", error)
    })
}

//////listening to cloud data///////
export const listenToUser = (userId, updateState) => {
  let unsubscribe = db
    .collection("users")
    .doc(userId)
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      let data = snapshot.data()
      data.id = snapshot.id
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"
      console.log(source, snapshot, data)
      updateState(data)
    })
  return unsubscribe
}

export const listenToMembers = (
  projectId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("users")
    .where("projects", "array-contains", projectId)
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"

      console.log(source, snapshot, docChange)

      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()

          //add id to data
          data.id = id

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
      }
    })
  return unsubscribe
}

export const listenToProjects = (
  userId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("projects")
    .where("members", "array-contains", userId)
    .orderBy("created_time", "desc")
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"
      console.log(userId)
      console.log(source, snapshot, docChange)
      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()

          //add id to data
          data.id = id
          //conver time object to string
          data.created_time = data.created_time.toDate().toString()

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
      }
    })
  return unsubscribe
}

export const listenToDayplans = (
  itineraryId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("dayplans")
    .where("itinerary_id", "==", itineraryId)
    .orderBy("date", "asc")
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"

      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()

          //add id to data
          data.id = id
          //conver time object to string
          data.date = data.date.toDate().toString()

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
      }
    })
  return unsubscribe
}

export const listenToCard = (
  projectId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("projects")
    .doc(projectId)
    .collection("cards")
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"

      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()

          // console.log(source, type, id, data)
          //add id to data
          data.id = id

          if (data.start_time) {
            //conver time object to string
            data.start_time = data.start_time.toDate().toString()
            data.end_time = data.end_time.toDate().toString()
          }

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
      }
    })
  return unsubscribe
}

export const listenToComments = (
  cardId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("comments")
    .where("card_id", "==", cardId)
    .orderBy("date", "asc")
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"

      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()
          // console.log(source, type, id, data)

          //add id to data
          data.id = id
          //conver time object to string
          data.date = data.date.toDate().toString()

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
        console.log("comments")
      }
    })
  return unsubscribe
}

export const listenToLinks = (
  cardId,
  handleAdd,
  handleModify,
  handleRemove
) => {
  let unsubscribe = db
    .collection("links")
    .where("card_id", "==", cardId)
    .orderBy("date", "asc")
    .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
      var docChange = snapshot.docChanges()
      var source = snapshot.metadata.hasPendingWrites ? "local" : "server"

      // console.log(source, snapshot, docChange)

      //local data needs to be changed
      if (docChange.length > 0) {
        snapshot.docChanges().forEach(function (change) {
          let type = change.type
          let id = change.doc.id
          let data = change.doc.data()
          // console.log(source, type, id, data)

          //add id to data
          data.id = id
          //conver time object to string
          data.date = data.date.toDate().toString()

          if (type === "added") {
            handleAdd(data, source)
          }
          if (type === "modified") {
            handleModify(data, source)
          }
          if (type === "removed") {
            handleRemove(data, source)
          }
        })
      } else {
        //changes have been saved
        console.log("data has been saved to cloud database")
        console.log("links")
      }
    })
  return unsubscribe
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

export const addProject_Fs = (input) => {
  let docRef = db.collection("projects")

  return docRef.add(input).catch(function (error) {
    console.error("Error adding document: ", error)
  })
}

export const updateProject_Fs = (projectId, change) => {
  let docRef = db.collection("projects").doc(projectId)

  return docRef.update(change).catch(function (error) {
    console.error("Error updating document: ", error)
  })
}

export const updateProjectMember_Fs = (projectId, type, targetUserId) => {
  let docRef = db.collection("projects").doc(projectId)
  let change

  if (type === "add") {
    change = {
      members: firebase.firestore.FieldValue.arrayUnion(targetUserId),
    }
  }
  if (type === "remove") {
    change = {
      members: firebase.firestore.FieldValue.arrayRemove(targetUserId),
    }
  }

  return docRef.update(change).catch(function (error) {
    console.error("Error updating document: ", error)
  })
}

export const removeProject_Fs = (projectId) => {
  let docRef = db.collection("projects").doc(projectId)

  return docRef.delete().catch(function (error) {
    console.error("Error deleting document: ", error)
  })
}

//////cards related//////
export const AddCard_Fs = (projectId, input) => {
  let docRef = db.collection("projects").doc(projectId).collection("cards")

  return docRef.add(input).catch(function (error) {
    console.error("Error adding document: ", error)
  })
}

export const updateCard_Fs = (projectId, cardId, change) => {
  // expected format:
  // let change = {
  //   title: input,
  // }

  let docRef = db
    .collection("projects")
    .doc(projectId)
    .collection("cards")
    .doc(cardId)

  return docRef.update(change).catch(function (error) {
    console.error("Error updating document: ", error)
  })
}

export const removeCard_Fs = (projectId, cardId) => {
  let docRef = db
    .collection("projects")
    .doc(projectId)
    .collection("cards")
    .doc(cardId)

  return docRef.delete().catch(function (error) {
    console.error("Error deleting document: ", error)
  })
}

export const addComment_Fs = (input) => {
  // expected format:
  // let input = {
  // card_id: cardId,
  // sender_id: userId,
  // content: pending,
  // date: date object,
  // }

  let docRef = db.collection("comments")

  return docRef.add(input).catch(function (error) {
    console.error("Error adding document: ", error)
  })
}

export const updateComment_Fs = (commentId, change) => {
  // expected format:
  // let change = {
  //   content: input,
  // }

  let docRef = db.collection("comments").doc(commentId)

  return docRef.update(change).catch(function (error) {
    console.error("Error updating document: ", error)
  })
}

export const removeComment_Fs = (commentId) => {
  let docRef = db.collection("comments").doc(commentId)

  return docRef.delete().catch(function (error) {
    console.error("Error deleting document: ", error)
  })
}

export const addLink_Fs = (input) => {
  // expected format:
  // let input = {
  // card_id: cardId,
  // url: url,
  // title: string,
  // date: date object,
  // }

  let docRef = db.collection("links")

  return docRef.add(input).catch(function (error) {
    console.error("Error adding document: ", error)
  })
}

export const updateLink_Fs = (linkId, change) => {
  // expected format:
  // let change = {
  //   title: input,
  // }

  let docRef = db.collection("links").doc(linkId)

  return docRef.update(change).catch(function (error) {
    console.error("Error updating document: ", error)
  })
}

export const removeLink_Fs = (linkId) => {
  let docRef = db.collection("links").doc(linkId)

  return docRef.delete().catch(function (error) {
    console.error("Error deleting document: ", error)
  })
}

//get info once

export const getProject_Fs = (projectId) => {
  let docRef = db.collection("projects").doc(projectId)

  return docRef
    .get()
    .then(function (doc) {
      return doc.data()
    })
    .catch(function (error) {
      console.log("Error getting document:", error)
    })
}

export const addDayplan_Fs = (input) => {
  let docRef = db.collection("dayplans")

  return docRef
    .add(input)
    .then(function (newDayplan) {
      newDayplan.update({
        id: newDayplan.id,
      })
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
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
