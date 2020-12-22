import Axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "./Loader";

class EditMod extends Component {
    fileObj = [];
    fileArray = [];

    thumbObj = [];
    thumbArray = [];

    screenObj = [];
    screenArray = [];

    newallUploadFile = [];
    newallUploadThumb = [];
    newallUploadScreens = [];

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            categoryid: "0",
            uploadfile: [],
            thumbnail: [],
            screenshot: [],
            description: "",
            ratings: "0",
            viewcount: "",
            downloadcount: "",
            allCategory: [],

            allUploadFiles: [],
            allThumbs: [],
            allScreenshots: [],

            isUpdatedFile: false,
            isUpdatedThumbnail: false,
            isUpdatedScreenshot: false,
            editedUploadfile: [],
            editedThumbnail: [],
            editedScreenshot: [],

            modid: props.location.state.modid,
            selectedMod: null,
            isLoading: false,
        };
    }

    getThumbnail = () => {
        this.newallUploadThumb = [];
        var array = this.state.selectedMod.thumbnail.split(",");

        for (let i = 0; i < array.length; i++) {
            let obj = {
                fileSrc: array[i],
            };
            this.newallUploadThumb.push(obj);
        }

        this.setState({ allThumbs: this.newallUploadThumb });
    };
    getScreenshot = () => {
        this.newallUploadScreens = [];
        var arraysc = this.state.selectedMod.screenshot.split(",");

        for (let i = 0; i < arraysc.length; i++) {
            let obj = {
                fileSrc: arraysc[i],
            };
            this.newallUploadScreens.push(obj);
        }

        this.setState({ allScreenshots: this.newallUploadScreens });
    };
    getStateValue = () => {
        this.setState({
            title: this.state.selectedMod.title,
            categoryid: this.state.selectedMod.categoryid,
            uploadfile: this.state.selectedMod.uploadfile,
            thumbnail: this.state.selectedMod.thumbnail,
            screenshot: this.state.selectedMod.screenshot,
            description: this.state.selectedMod.description,
            ratings: this.state.selectedMod.ratings,
            viewcount: this.state.selectedMod.viewcount,
            downloadcount: this.state.selectedMod.downloadcount,
            editedUploadfile: this.state.selectedMod.uploadfile,
            editedThumbnail: this.state.selectedMod.thumbnail,
            editedScreenshot: this.state.selectedMod.screenshot,
        });
    };
    componentDidMount() {
        Axios.get(`http://abc.top/getModById.php?id=` + this.state.modid)
            .then((res) => {
                this.setState({
                    selectedMod: res.data,
                });

                this.state.selectedMod && this.getStateValue();
                this.state.selectedMod && this.getThumbnail();
                this.state.selectedMod && this.getScreenshot();
            })
            .catch((err) => {
                console.log(err);
            });

        Axios.get(`http://abc.top/get_category.php`)
            .then((res) =>
                this.setState({
                    allCategory: res.data,
                })
            )
            .catch((err) => {
                console.log(err);
            });
    }
    resetFields = () => {
        this.setState({
            title: "",
            categoryid: "0",
            uploadfile: [],
            thumbnail: [],
            screenshot: [],
            description: "",
            ratings: "0",
            viewcount: "",
            downloadcount: "",
            allCategory: [],

            allUploadFiles: [],
            allThumbs: [],
            allScreenshots: [],
        });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    uploadfile = (e) => {
        if (e.target.files.length > 0) {
            var fileName = e.target.files[0].name;
            var idxDot = fileName.lastIndexOf(".") + 1;
            var extFile = fileName
                .substr(idxDot, fileName.length)
                .toLowerCase();
            if (
                extFile === "jpg" ||
                extFile === "jpeg" ||
                extFile === "png" ||
                extFile === "gif" ||
                extFile === "bmp"
            ) {
                toast("Image file not allowed. Please select another file", {
                    className: "error__message",
                });
                return false;
            } else {
                this.fileObj.push(e.target.files);
                this.newallUploadFile = [];
                for (let i = 0; i < e.target.files.length; i++) {
                    this.screenArray.push(this.fileObj[0][i].name);
                    let obj = {
                        fileSrc: URL.createObjectURL(e.target.files[i]),
                    };
                    this.newallUploadFile.push(obj);
                    this.setState({ isUpdatedFile: true });
                }
                this.setState({ uploadfile: e.target.files[0] });
                this.setState({ allUploadFiles: this.newallUploadFile });
                //this.setState({ editedUploadfile: this.newallUploadFile });
            }
        }
    };
    uploadthumbnail = (e) => {
        this.thumbObj.push(e.target.files);
        this.newallUploadThumb = [];
        for (let i = 0; i < e.target.files.length; i++) {
            this.screenArray.push(this.thumbObj[0][i].name);
            let obj = {
                fileSrc: URL.createObjectURL(e.target.files[i]),
            };
            this.newallUploadThumb.push(obj);
            this.setState({ isUpdatedThumbnail: true });
        }
        this.setState({ thumbnail: e.target.files[0] });
        this.setState({ allThumbs: this.newallUploadThumb });
        //this.setState({ editedThumbnail: this.newallUploadThumb });
    };
    uploadscreenshot = (e) => {
        this.newallUploadScreens = [];
        for (let i = 0; i < e.target.files.length; i++) {
            let obj = {
                fileSrc: window.URL.createObjectURL(e.target.files[i]),
            };
            this.newallUploadScreens.push(obj);
            this.setState({ isUpdatedScreenshot: true });
        }
        this.setState({ screenshot: e.target.files });
        this.setState({ allScreenshots: this.newallUploadScreens });
        //this.setState({ editedScreenshot: this.newallUploadScreens });
    };

    checkEmptyField = () => {
        if (this.state.title === "") {
            return false;
        }
        if (this.state.categoryid === "0") {
            return false;
        }
        if (this.state.uploadfile.length <= 0) {
            return false;
        }
        if (this.state.thumbnail.length <= 0) {
            return false;
        }
        if (this.state.screenshot.length <= 0) {
            return false;
        }
        if (this.state.description === "") {
            return false;
        }
        if (this.state.ratings === "0") {
            return false;
        }
        if (this.state.viewcount === "") {
            return false;
        }
        if (this.state.downloadcount === "") {
            return false;
        }
        return true;
    };
    nextPath(path) {
        this.props.history.push(path);
    }
    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ isLoading: true });
        const formData = new FormData();
        //formData.append("modid", this.state.modid);
        formData.append("title", this.state.title);
        formData.append("categoryid", this.state.categoryid);

        formData.append("isUpdatedFile", this.state.isUpdatedFile);
        formData.append("isUpdatedThumbnail", this.state.isUpdatedThumbnail);
        formData.append("isUpdatedScreenshot", this.state.isUpdatedScreenshot);

        formData.append("file", this.state.uploadfile);
        formData.append("thumbnail", this.state.thumbnail);

        if (this.state.isUpdatedScreenshot) {
            for (let i = 0; i < this.state.screenshot.length; i++) {
                formData.append("screenshot[]", this.state.screenshot[i]);
            }
        } else {
            formData.append("screenshot", this.state.screenshot);
        }
        formData.append("description", this.state.description);
        formData.append("ratings", this.state.ratings);
        formData.append("viewcount", this.state.viewcount);
        formData.append("downloadcount", this.state.downloadcount);

        if (this.checkEmptyField()) {
            Axios.post(
                "http://abc.top/update_mod.php?id=" + this.state.modid,
                formData
            ).then((res) => {
                toast(res.data, {
                    className: "success__message__modal",
                });
                this.resetFields();
                setTimeout(() => {
                    this.setState({ isLoading: false });
                    this.nextPath("");
                }, 3000);
            });
        } else {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 3000);
            toast("Please give all information and Update Mod", {
                className: "error__message__modal",
            });
        }
    };

    getSplitedFileName = (fileName) => {
        var retFile = "";
        if (fileName.length > 0) {
            var splited = fileName.split("/");
            retFile = splited[splited.length - 1];
        }
        return retFile;
    };
    getSplitedFileNameForDownload = (fileName) => {
        var retFile = "";
        if (fileName.length > 0) {
            var splited = fileName.split("/");
            retFile = splited[splited.length - 1];
            retFile = "./../uploadedimageandfile/" + retFile;
        }
        return retFile;
    };

    getImage = (src) => {
        var retFile = "";
        if (src.length > 0) {
            var splited = src.split("/");
            retFile = splited[splited.length - 1];
            retFile = "./../uploadedimageandfile/" + retFile;
        }
        return retFile;
    };
    render() {
        return (
            <div>
                {this.state.isLoading && <Loader />}
                <div className="mod__modal">
                    <div className="title__container">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={this.state.title}
                            placeholder="Enter Title"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="category__container">
                        <label>Category:</label>
                        <select
                            name="categoryid"
                            value={this.state.categoryid}
                            onChange={this.handleChange}
                        >
                            <option value="0">--- Select Category ---</option>
                            {this.state.allCategory.map((cat, index) => (
                                <option key={index} value={cat.categoryid}>
                                    {cat.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="file__container">
                        <label>Upload File:</label>
                        <input
                            type="file"
                            name="file"
                            onChange={this.uploadfile}
                        />
                        <div className="show__screenshot">
                            {this.state.uploadfile.length > 0 ? (
                                <a
                                    download={this.getSplitedFileName(
                                        this.state.uploadfile
                                    )}
                                    href={this.getSplitedFileNameForDownload(
                                        this.state.uploadfile
                                    )}
                                >
                                    {this.getSplitedFileName(
                                        this.state.uploadfile
                                    )}
                                </a>
                            ) : null}
                        </div>
                    </div>
                    <div className="thumbnail__container">
                        <label>Thumbnail:</label>
                        <input
                            type="file"
                            name="thnumbnail"
                            onChange={this.uploadthumbnail}
                            accept="image/*"
                        />
                        <div className="show__screenshot">
                            {this.state.allThumbs &&
                                this.state.allThumbs.map((item, index) => (
                                    <img
                                        key={index}
                                        src={
                                            this.state.isUpdatedThumbnail
                                                ? item.fileSrc
                                                : this.getImage(item.fileSrc)
                                        }
                                        alt="thumbnail"
                                    />
                                ))}
                        </div>
                    </div>
                    <div className="screenshot__container">
                        <label>Screenshot:</label>
                        <input
                            type="file"
                            name="screenshot"
                            multiple
                            onChange={this.uploadscreenshot}
                            accept="image/*"
                        />
                        <div className="show__screenshot">
                            {this.state.allScreenshots.map((item, index) => (
                                <img
                                    key={index}
                                    src={
                                        this.state.isUpdatedScreenshot
                                            ? item.fileSrc
                                            : this.getImage(item.fileSrc)
                                    }
                                    alt="screenshot"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="description__container">
                        <label>Description:</label>
                        {/* <textarea
                        rows="8"
                        className="txtarea"
                        name="description"
                        value={this.state.description}
                        placeholder="Enter Description"
                        onChange={this.handleChange}
                    ></textarea> */}
                        <div className="editor">
                            <CKEditor
                                editor={ClassicEditor}
                                name="description"
                                data={this.state.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    this.setState({ description: data });
                                }}
                            />
                        </div>
                    </div>
                    <div className="rating__container">
                        <label>Ratings:</label>
                        <select
                            name="ratings"
                            value={this.state.ratings}
                            onChange={this.handleChange}
                        >
                            <option value="0">--- Select Rate ---</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="viewcount__container">
                        <label>View Count:</label>
                        <input
                            type="number"
                            name="viewcount"
                            value={this.state.viewcount}
                            placeholder="Enter View Count"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="viewdownload__container">
                        <label>Download Count:</label>
                        <input
                            type="number"
                            name="downloadcount"
                            value={this.state.downloadcount}
                            placeholder="Enter Download Count"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="button__container">
                        <button
                            className="btn primary"
                            onClick={this.handleSubmit}
                        >
                            Update Mod
                        </button>
                        <ToastContainer
                            position="top-center"
                            autoClose={3000}
                            pauseOnHover
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(EditMod);
