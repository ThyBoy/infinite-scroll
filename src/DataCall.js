import { auth, storageRef, firestore } from "./firebase.utils";

export class DataCall {
  constructor(imageRef) {
    this.lastVisible = null;
    this.imageRef = imageRef;
  }

  async getMore() {
    let data = [];
    let querySnapshot = this.lastVisible
      ? await this.imageRef
          .orderBy('createdAt')
          .startAfter(this.lastVisible)
          .limit(20)
          .get()
      : await this.imageRef.orderBy('createdAt').limit(20).get();
    if (querySnapshot.docs[querySnapshot.docs.length - 1])
      this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    querySnapshot.forEach((doc) => {
      data.push({ name: doc.id, ...doc.data() });
    });
    return data;
  }
}

export function deleteImage(storageName, docName) {
  console.log(docName)
  storageRef
    .child(storageName)
    .delete()
    .then(() => {
      console.log("File Deleted");
    })
    .catch((error) => {
      console.log("Error while Deleting", error);
    });

  firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("images")
    .doc(docName)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  storageName = storageName.split("/")[1];
  storageName = storageName.split(".")[0];
  console.log(storageName);
  firestore
    .collection("images")
    .doc(storageName)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}
