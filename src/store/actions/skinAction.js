import { isElement } from "react-dom/test-utils";
import { actionTypes } from "react-redux-firebase";
import {
    FETCH_SKIN,
    ADD_SKIN,
    DELETE_SKIN,
    FETCH_SKIN_BY_ID,
    FETCH_ALL_FILE,
    EDIT_SKIN,
} from "../actionTypes";

const firebase = require("firebase");
export const fetchMod = () => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_skins").onSnapshot((data) => {
        const allMods = data.docs.map((_doc) => {
            const data = _doc.data();
            data["id"] = _doc.id;
            return data;
        });
        dispatch({
            type: FETCH_SKIN,
            payload: allMods,
        });
    });
};

export const fetchAllFileImage = () => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_fileimage_collection").onSnapshot((data) => {
        const allFilesImgs = data.docs.map((_doc) => {
            const data = _doc.data();
            return data;
        });

        dispatch({
            type: FETCH_ALL_FILE,
            payload: allFilesImgs,
        });
    });
};

export const fetchModById = (id) => async (dispatch) => {
    const db = firebase.firestore();
    let allScreenshots = [];
    let allThumbs = [];
    let uploadfile = [];
    let selectedMod = null;
    await db
        .collection("mod_skins")
        .doc(id)
        .get()
        .then((_doc) => {
            if (_doc.exists) {
                selectedMod = _doc.data();

                selectedMod["id"] = _doc.id;
            }
        });
    dispatch({
        type: FETCH_SKIN_BY_ID,
        payload: selectedMod,
    });
};

export const addMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_skins")
        .add({
            title: obj.title,
            categoryid: obj.categoryid,

            ratings: obj.ratings,
            viewcount: obj.viewcount,
            downloadcount: obj.downloadcount,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((res) => {
            const currentSavedId = res.id;

            //uploadfile ==> uploadedfileimage/
            const storage = firebase.storage();
            const min = 1;
            const max = 90000000;
            let time = min + Math.random() * (max - min);

            //allThumbs
            time = min + Math.random() * (max - min);
            const thumbName = time + "_" + obj.thumbnail.name;
            let upThumb = storage
                .ref(`/uploadedfileimage/${thumbName}`)
                .put(obj.thumbnail);
            upThumb.on(
                "state_changed",
                (snapshot) => {
                    //console.log(snapshot);
                },
                (err) => {
                    console.log(err);
                },
                () => {
                    storage
                        .ref("uploadedfileimage")
                        .child(thumbName)
                        .getDownloadURL()
                        .then((firebaseurl) => {
                            db.collection("mod_fileimage_collection").add({
                                file: firebaseurl,
                                modtype: "skin",
                                modtypeid: currentSavedId,
                                field: "thumb",
                                filename: thumbName,
                            });
                        });
                }
            );
            //screenshot
            for (let i = 0; i < obj.screenshot.length; i++) {
                time = min + Math.random() * (max - min);
                let screenName = time + "_" + obj.screenshot[i].name;
                let upScreen = storage
                    .ref(`/uploadedfileimage/${screenName}`)
                    .put(obj.screenshot[i]);
                upScreen.on(
                    "state_changed",
                    (snapshot) => {
                        //console.log(snapshot);
                    },
                    (err) => {
                        console.log(err);
                    },
                    () => {
                        storage
                            .ref("uploadedfileimage")
                            .child(screenName)
                            .getDownloadURL()
                            .then((firebaseurl) => {
                                db.collection("mod_fileimage_collection").add({
                                    file: firebaseurl,
                                    modtype: "skin",
                                    modtypeid: currentSavedId,
                                    field: "screen",
                                    filename: screenName,
                                });
                            });
                    }
                );
            }
            dispatch({
                type: ADD_SKIN,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: ADD_SKIN,
                payload: false,
            });
        });
};

export const editMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    const updateRef = firebase
        .firestore()
        .collection("mod_skins")
        .doc(obj.modid);
    updateRef
        .set({
            title: obj.title,
            categoryid: obj.categoryid,

            ratings: obj.ratings,
            viewcount: obj.viewcount,
            downloadcount: obj.downloadcount,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((res) => {
            //NEED TO START WORK FROM HERE TOMORROW DELETE CURRENT FILE IMAGE AND ADD NEW WITH REFERENCE IN LINK TABLE

            const storage = firebase.storage();
            const min = 1;
            const max = 90000000;
            let time = min + Math.random() * (max - min);

            if (obj.isUpdatedThumbnail) {
                var deleteFromMod = db
                    .collection("mod_fileimage_collection")
                    .where("modtypeid", "==", obj.modid)
                    .where("field", "==", "thumb");
                deleteFromMod.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.delete();
                    });
                });

                time = min + Math.random() * (max - min);
                const thumbName = time + "_" + obj.thumbnail.name;
                let upThumb = storage
                    .ref(`/uploadedfileimage/${thumbName}`)
                    .put(obj.thumbnail);
                upThumb.on(
                    "state_changed",
                    (snapshot) => {
                        //console.log(snapshot);
                    },
                    (err) => {
                        console.log(err);
                    },
                    () => {
                        storage
                            .ref("uploadedfileimage")
                            .child(thumbName)
                            .getDownloadURL()
                            .then((firebaseurl) => {
                                db.collection("mod_fileimage_collection").add({
                                    file: firebaseurl,
                                    modtype: "skin",
                                    modtypeid: obj.modid,
                                    field: "thumb",
                                    filename: thumbName,
                                });
                            });
                    }
                );
            }
            if (obj.isUpdatedScreenshot) {
                var deleteFromMod = db
                    .collection("mod_fileimage_collection")
                    .where("modtypeid", "==", obj.modid)
                    .where("field", "==", "screen");
                deleteFromMod.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.delete();
                    });
                });
                for (let i = 0; i < obj.screenshot.length; i++) {
                    time = min + Math.random() * (max - min);
                    let screenName = time + "_" + obj.screenshot[i].name;
                    let upScreen = storage
                        .ref(`/uploadedfileimage/${screenName}`)
                        .put(obj.screenshot[i]);
                    upScreen.on(
                        "state_changed",
                        (snapshot) => {
                            //console.log(snapshot);
                        },
                        (err) => {
                            console.log(err);
                        },
                        () => {
                            storage
                                .ref("uploadedfileimage")
                                .child(screenName)
                                .getDownloadURL()
                                .then((firebaseurl) => {
                                    db.collection(
                                        "mod_fileimage_collection"
                                    ).add({
                                        file: firebaseurl,
                                        modtype: "skin",
                                        modtypeid: obj.modid,
                                        field: "screen",
                                        filename: screenName,
                                    });
                                });
                        }
                    );
                }
            }

            // var deleteFromMod = db
            //     .collection("mod_fileimage_collection")
            //     .where("modtypeid", "==", obj.modid);
            // deleteFromMod.get().then(function (querySnapshot) {
            //     querySnapshot.forEach(function (doc) {
            //         doc.ref.delete();
            //     });
            // });

            // //uploadfile ==> uploadedfileimage/
            // if (obj.isupload === "true") {
            //     const upFileName = time + "_" + obj.uploadfile.name;
            //     let upFile = storage
            //         .ref(`/uploadedfileimage/${upFileName}`)
            //         .put(obj.uploadfile);
            //     upFile.on(
            //         "state_changed",
            //         (snapshot) => {
            //             //console.log(snapshot);
            //         },
            //         (err) => {
            //             console.log(err);
            //         },
            //         () => {
            //             storage
            //                 .ref("uploadedfileimage")
            //                 .child(upFileName)
            //                 .getDownloadURL()
            //                 .then((firebaseurl) => {
            //                     db.collection("mod_fileimage_collection").add({
            //                         file: firebaseurl,
            //                         modtype: "skin",
            //                         modtypeid: obj.modid,
            //                         field: "file",
            //                         filename: upFileName,
            //                     });
            //                 });
            //         }
            //     );
            // }
            // //allThumbs
            // time = min + Math.random() * (max - min);
            // const thumbName = time + "_" + obj.thumbnail.name;
            // let upThumb = storage
            //     .ref(`/uploadedfileimage/${thumbName}`)
            //     .put(obj.thumbnail);
            // upThumb.on(
            //     "state_changed",
            //     (snapshot) => {
            //         //console.log(snapshot);
            //     },
            //     (err) => {
            //         console.log(err);
            //     },
            //     () => {
            //         storage
            //             .ref("uploadedfileimage")
            //             .child(thumbName)
            //             .getDownloadURL()
            //             .then((firebaseurl) => {
            //                 db.collection("mod_fileimage_collection").add({
            //                     file: firebaseurl,
            //                     modtype: "skin",
            //                     modtypeid: obj.modid,
            //                     field: "thumb",
            //                     filename: thumbName,
            //                 });
            //             });
            //     }
            // );
            //screenshot
            // for (let i = 0; i < obj.screenshot.length; i++) {
            //     time = min + Math.random() * (max - min);
            //     let screenName = time + "_" + obj.screenshot[i].name;
            //     let upScreen = storage
            //         .ref(`/uploadedfileimage/${screenName}`)
            //         .put(obj.screenshot[i]);
            //     upScreen.on(
            //         "state_changed",
            //         (snapshot) => {
            //             //console.log(snapshot);
            //         },
            //         (err) => {
            //             console.log(err);
            //         },
            //         () => {
            //             storage
            //                 .ref("uploadedfileimage")
            //                 .child(screenName)
            //                 .getDownloadURL()
            //                 .then((firebaseurl) => {
            //                     db.collection("mod_fileimage_collection").add({
            //                         file: firebaseurl,
            //                         modtype: "skin",
            //                         modtypeid: obj.modid,
            //                         field: "screen",
            //                         filename: screenName,
            //                     });
            //                 });
            //         }
            //     );
            // }

            dispatch({
                type: EDIT_SKIN,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: EDIT_SKIN,
                payload: false,
            });
        });
};

export const deleteMod = (id) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_skins")
        .doc(id)
        .delete()
        .then((res) => {
            dispatch({
                type: DELETE_SKIN,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: DELETE_SKIN,
                payload: false,
            });
        });
};
