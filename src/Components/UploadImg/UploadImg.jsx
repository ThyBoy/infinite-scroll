import { useState, useRef } from "react";
import "./UploadImg.scss";
import { auth, firestore, storageRef } from "../../firebase.utils";

function UploadImg({ setIsDropDown }) {
  const [file, setFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const [propmtVisible, setPromptVisible] = useState(false);
  const observer = useRef(null);

  function handleChange(event) {
    setFile(event.target.files[0]);
    setPromptVisible(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setUploadPercentage(0);
    // Create the file metadata

    const random = String(Math.floor(Math.random() * 100000000));
    const fileName = "images/" + random + "." + file.name.split(".")[1];

    // Upload file and metadata
    var uploadTask = storageRef.child(fileName).put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          console.log("File available at", downloadURL);

          const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
          const snapshot = await userRef.get();

          if (!snapshot.exists) {
            try {
              await userRef.set({ name: auth.currentUser.displayName });
            } catch (error) {
              console.log("error creating user", error.message);
            }
          }
          try {
            await userRef
              .collection("images")
              .doc(file.name)
              .set({
                storageName: fileName,
                url: downloadURL,
                createdAt: new Date(),
              });
          } catch (error) {
            console.log("error creating image", error.message);
          }
          try {
            await firestore.collection("images").doc(random).set({
              name: file.name,
              url: downloadURL,
              uploader: auth.currentUser.displayName,
              createdAt: new Date(),
            });
          } catch (error) {
            console.log("error creating image", error.message);
          }
        });
        setUploadPercentage(null);
        observer.current.value = "";
        setFile(null);
        setPromptVisible(true);
      }
    );
  }

  return (
    <div className="upload-dropdown">
      <div className="close">
        <p className="cross" onClick={() => setIsDropDown(false)}>
          &#10005;
        </p>
      </div>
      {file ? (
        <img className="preview" src={URL.createObjectURL(file)} alt="" />
      ) : null}
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          id="upload-input"
          name="file"
          type="file"
          onChange={handleChange}
          label="File"
          ref={observer}
          required
        />
        <button
          style={{
            background: `linear-gradient(to right, grey ${
              uploadPercentage != null ? uploadPercentage : 0
            }%, white ${uploadPercentage != null ? uploadPercentage : 0}%)`,
          }}
          className="progress-button"
          type="submit"
        >
          <p>{`${
            uploadPercentage != null ? uploadPercentage + "%" : "Upload"
          }`}</p>
        </button>
      </form>
      {propmtVisible ? <p className="prompt">Uploaded !!</p> : null}
    </div>
  );
}

export default UploadImg;
