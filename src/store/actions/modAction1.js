import { actionTypes } from "react-redux-firebase";
import {
    FETCH_MOD,
    ADD_MOD,
    DELETE_MOD,
    FETCH_MOD_BY_ID,
} from "../actionTypes";

const firebase = require("firebase");
export const fetchMod = () => async (dispatch) => {
    const db = firebase.firestore();
    await db.collection("mod_mods").onSnapshot((data) => {
        const allMods = data.docs.map((_doc) => {
            const data = _doc.data();
            data["id"] = _doc.id;

            let allFilesImages = [];
            let allScreenshots = [];
            let allThumbs = [];
            let uploadfile = [];

            db.collection("mod_fileimage_collection").onSnapshot((snap) => {
                // if (snap && snap.exists) {
                //     console.log("inside");
                //     snap.forEach((doc) => {
                //         const data = doc.data();
                //         allFilesImages.push(data);
                //     });
                // }
                const filesImages = snap.docs.map((_img) => {
                    const fdata = _img.data();
                    if (
                        _doc.id === fdata.modtypeid &&
                        fdata.modtype === "mod" &&
                        fdata.field === "file"
                    ) {
                        let obj = {
                            fileSrc: fdata.file,
                            filename: fdata.filename,
                        };
                        uploadfile.push(obj);
                    }
                    if (
                        _doc.id === fdata.modtypeid &&
                        fdata.modtype === "mod" &&
                        fdata.field === "thumb"
                    ) {
                        let obj = {
                            fileSrc: fdata.file,
                        };
                        allThumbs.push(obj);
                    }
                    if (
                        _doc.id === fdata.modtypeid &&
                        fdata.modtype === "mod" &&
                        fdata.field === "screen"
                    ) {
                        let obj = {
                            fileSrc: fdata.file,
                        };
                        allScreenshots.push(obj);
                    }
                });
            });
            data["uploadfile"] = uploadfile;
            data["allThumbs"] = allThumbs;
            data["allScreenshots"] = allScreenshots;

            return data;
        });
        dispatch({
            type: FETCH_MOD,
            payload: allMods,
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
        .collection("mod_mods")
        .doc(id)
        .get()
        .then((_doc) => {
            if (_doc.exists) {
                selectedMod = _doc.data();

                selectedMod["id"] = _doc.id;

                db.collection("mod_fileimage_collection").onSnapshot((snap) => {
                    // if (snap && snap.exists) {
                    //     console.log("inside");
                    //     snap.forEach((doc) => {
                    //         const data = doc.data();
                    //         allFilesImages.push(data);
                    //     });
                    // }
                    const filesImages = snap.docs.map((_img) => {
                        const fdata = _img.data();
                        if (
                            _doc.id === fdata.modtypeid &&
                            fdata.modtype === "mod" &&
                            fdata.field === "file"
                        ) {
                            let obj = {
                                fileSrc: fdata.file,
                                filename: fdata.filename,
                            };
                            uploadfile.push(obj);
                        }
                        if (
                            _doc.id === fdata.modtypeid &&
                            fdata.modtype === "mod" &&
                            fdata.field === "thumb"
                        ) {
                            let obj = {
                                fileSrc: fdata.file,
                                filename: fdata.filename,
                            };
                            allThumbs.push(obj);
                        }
                        if (
                            _doc.id === fdata.modtypeid &&
                            fdata.modtype === "mod" &&
                            fdata.field === "screen"
                        ) {
                            let obj = {
                                fileSrc: fdata.file,
                                filename: fdata.filename,
                            };
                            allScreenshots.push(obj);
                        }
                    });
                });
                selectedMod.allThumbs = allThumbs;
                selectedMod.allScreenshots = allScreenshots;
                selectedMod.uploadfile = uploadfile;
            }
        });
    dispatch({
        type: FETCH_MOD_BY_ID,
        payload: selectedMod,
    });
};

export const addMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_mods")
        .add({
            title: obj.title,
            categoryid: obj.categoryid,
            isupload: obj.isupload,
            fileurl: obj.fileurl,
            description: obj.description,
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

            if (obj.isupload) {
                let upFile = storage
                    .ref(`/uploadedfileimage/${obj.uploadfile.name}`)
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
                            .child(obj.uploadfile.name)
                            .getDownloadURL()
                            .then((firebaseurl) => {
                                db.collection("mod_fileimage_collection").add({
                                    file: firebaseurl,
                                    modtype: "mod",
                                    modtypeid: currentSavedId,
                                    field: "file",
                                    filename: obj.uploadfile.name,
                                });
                            });
                    }
                );

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
                                    modtype: "mod",
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
                                    db.collection(
                                        "mod_fileimage_collection"
                                    ).add({
                                        file: firebaseurl,
                                        modtype: "mod",
                                        modtypeid: currentSavedId,
                                        field: "screen",
                                        filename: screenName,
                                    });
                                });
                        }
                    );
                }
            }

            dispatch({
                type: ADD_MOD,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: ADD_MOD,
                payload: false,
            });
        });
};

export const editMod = (obj) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_mods")
        .add({
            title: obj.title,
            categoryid: obj.categoryid,
            isupload: obj.isupload,
            fileurl: obj.fileurl,
            description: obj.description,
            ratings: obj.ratings,
            viewcount: obj.viewcount,
            downloadcount: obj.downloadcount,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((res) => {
            console.log("res data: ", res.id);
            //allUploadFiles
            //allThumbs
            //allScreenshots
            dispatch({
                type: ADD_MOD,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: ADD_MOD,
                payload: false,
            });
        });
};

export const deleteMod = (id) => (dispatch) => {
    const db = firebase.firestore();
    db.collection("mod_mods")
        .doc(id)
        .delete()
        .then((res) => {
            dispatch({
                type: DELETE_MOD,
                payload: true,
            });
        })
        .catch((err) => {
            dispatch({
                type: DELETE_MOD,
                payload: false,
            });
        });
};

export const getAllImageFileById = (id) => (dispatch) => {};
