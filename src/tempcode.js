import { auth, firestore, storageRef } from "./firebase.utils";

export async function upload20Pages(t) {
  if (!t) {
    for (let i = 1; i < 4; i++) {
      setTimeout(() => uploadImage(i), i * 10000);
    }
  }
  return 1000;
}

async function uploadImage(i) {
  console.log("called" + i);
  fetch(
    `https://pixabay.com/api/?key=22788057-b1d3f31c7a63e257881946234&q=nature&pretty=true&orientation=vertical&page=${i}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.hits.forEach((element) => {
        let name = element.pageURL.split("/");
        name = name[name.length - 2];
        let type = element.largeImageURL.split(".");
        type = type[type.length - 1];

        const fileName = String(Math.floor(Math.random() * 1000000000000));

        fetch(element.largeImageURL)
          .then((res) => res.blob())
          .then((blob) => {
            storageRef
              .child("images/" + fileName + "." + type)
              .put(blob)
              .then(function (snapshot) {
                return snapshot.ref.getDownloadURL();
              })
              .then(async (url) => {
                console.log("Firebase storage image uploaded : ", url);

                const imageRef = firestore
                  .collection("users")
                  .doc(auth.currentUser.uid)
                  .collection("images")
                  .doc(name);
                try {
                  await imageRef.set({
                    storageName: "images/" + fileName + "." + type,
                    url: url,
                    createdAt: new Date(),
                  });
                } catch (error) {
                  console.log("error creating image", error.message);
                }
                try {
                  await firestore.collection("images").doc(fileName).set({
                    name: name,
                    url: url,
                    uploader: auth.currentUser.displayName,
                    createdAt: new Date(),
                  });
                } catch (error) {
                  console.log("error creating image", error.message);
                }
              });
          });
      });
    });
}
