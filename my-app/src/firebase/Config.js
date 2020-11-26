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

//////library//////
export const test = () => {
  getUserInfo("test").then(p)
}

export const update = (data) => {
  db.collection("test").doc("2eddU3pn48Llu7Ji60Nz").update({
    content: data,
  })
}

export const listenToData = (callback) => {
  db.collection("test").onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      if (change.type === "modified") {
        let data = change.doc.data()
        callback(data.content)
        // if (data.receiver === defalutUser) {
        //   searchInDb("users", "user_id", data.sender).then((users) => {
        //     let user = users[0];
        //     console.log(`${user.name} 對您傳送了交友邀請`);
        //     displayRequest(user, change.doc.id);
        //   });
        // }
      }
    })
  })
}

// db.collection("test")
//   .add(data)
//   .then(function (docRef) {
//     docRef.update({
//       id: docRef.id,
//     })
//     console.log("已經發出貼文:" + data)
//   })

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
