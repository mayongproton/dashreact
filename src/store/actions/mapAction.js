import { isElement } from "react-dom/test-utils";
import { actionTypes } from "react-redux-firebase";
import {
    FETCH_MAP,
    ADD_MAP,
    DELETE_MAP,
    FETCH_MAP_BY_ID,
    FETCH_ALL_FILE,
    EDIT_MAP,
} from "../actionTypes";

const firebase = require("firebase");
export const fetchMod = () => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_maps").onSnapshot((data) => {
        const allMods = data.docs.map((_doc) => {
            const data = _doc.data();
            data["id"] = _doc.id;
            return data;
        });
        dispatch({
            type: FETCH_MAP,
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
        .collection("mod_maps")
        .doc(id)
        .get()
        .then((_doc) => {
            if (_doc.exists) {
                selectedMod = _doc.data();

                selectedMod["id"] = _doc.id;
            }
        });
    dispatch({
        type: FETCH_MAP_BY_ID,
        payload: selectedMod,
    });
};

export const addMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_maps")
        .add({
            title: obj.title,
            categoryid: obj.categoryid,
            isupload: obj.isupload,
            fileurl: obj.fileurl,
            description: obj.description.toString('html'),
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

            if (obj.isupload === "true") {
                const upFileName = time + "_" + obj.uploadfile.name;
                let upFile = storage
                    .ref(`/uploadedfileimage/${upFileName}`)
                    .put(obj.uploadfile);
                upFile.on(
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
                            .child(upFileName)
                            .getDownloadURL()
                            .then((firebaseurl) => {
                                db.collection("mod_fileimage_collection").add({
                                    file: firebaseurl,
                                    modtype: "map",
                                    modtypeid: currentSavedId,
                                    field: "file",
                                    filename: upFileName,
                                });
                            });
                    }
                );
            }

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
                                modtype: "map",
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
                                    modtype: "map",
                                    modtypeid: currentSavedId,
                                    field: "screen",
                                    filename: screenName,
                                });
                            });
                    }
                );
            }
            dispatch({
                type: ADD_MAP,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: ADD_MAP,
                payload: false,
            });
        });
};

export const editMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    const updateRef = firebase
        .firestore()
        .collection("mod_maps")
        .doc(obj.modid);
    updateRef
        .set({
            title: obj.title,
            categoryid: obj.categoryid,
            isupload: obj.isupload,
            fileurl: obj.fileurl,
            description: obj.description.toString('html'),
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

            if (obj.isupload === "true") {
                if (obj.isUpdatedFile) {
                    var deleteFromMod = db
                        .collection("mod_fileimage_collection")
                        .where("modtypeid", "==", obj.modid)
                        .where("field", "==", "file");
                    deleteFromMod.get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            doc.ref.delete();
                        });
                    });

                    const upFileName = time + "_" + obj.uploadfile.name;
                    let upFile = storage
                        .ref(`/uploadedfileimage/${upFileName}`)
                        .put(obj.uploadfile);
                    upFile.on(
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
                                .child(upFileName)
                                .getDownloadURL()
                                .then((firebaseurl) => {
                                    db.collection(
                                        "mod_fileimage_collection"
                                    ).add({
                                        file: firebaseurl,
                                        modtype: "map",
                                        modtypeid: obj.modid,
                                        field: "file",
                                        filename: upFileName,
                                    });
                                });
                        }
                    );
                }
            }
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
                                    modtype: "map",
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
                                        modtype: "map",
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
            //                         modtype: "map",
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
            //                     modtype: "map",
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
            //                         modtype: "map",
            //                         modtypeid: obj.modid,
            //                         field: "screen",
            //                         filename: screenName,
            //                     });
            //                 });
            //         }
            //     );
            // }

            dispatch({
                type: EDIT_MAP,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: EDIT_MAP,
                payload: false,
            });
        });
};

export const deleteMod = (id) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_maps")
        .doc(id)
        .delete()
        .then((res) => {
            dispatch({
                type: DELETE_MAP,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: DELETE_MAP,
                payload: false,
            });
        });
};
