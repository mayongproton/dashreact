import Axios from "axios";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Mod extends Component {
    fileObj = [];
    fileArray = [];

    thumbObj = [];
    thumbArray = [];

    screenObj = [];
    screenArray = [];

    constructor() {
        super();
        this.state = {
            title: "",
            categoryid: "",
            uploadfile: [null],
            thumbnail: [null],
            screenshot: [null],
            description: "",
            ratings: "",
            viewcount: "",
            downloadcount: "",
            allCategory: [],
        };
    }
    componentDidMount() {
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    uploadfile = (e) => {
        this.fileObj.push(e.target.files);
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.screenArray.push(this.fileObj[0][i].name);
        }
        this.setState({ uploadfile: this.fileArray });
    };
    uploadthumbnail = (e) => {
        this.thumbObj.push(e.target.files);
        for (let i = 0; i < this.thumbObj[0].length; i++) {
            this.screenArray.push(this.thumbObj[0][i].name);
        }
        this.setState({ thumbnail: this.thumbArray });
    };
    uploadscreenshot = (e) => {
        this.screenObj.push(e.target.files);
        for (let i = 0; i < this.screenObj[0].length; i++) {
            this.screenArray.push(this.screenObj[0][i].name);
        }
        this.setState({ screenshot: this.screenArray });
    };

    checkEmptyField = () => {
        if (this.state.title === "") {
            return false;
        }
        if (this.state.categoryid === "0") {
            return false;
        }
        if (this.state.uploadfile === "") {
            return false;
        }
        if (this.state.thumbnail === "") {
            return false;
        }
        if (this.state.screenshot === "") {
            return false;
        }
        if (this.state.description === "") {
            return false;
        }
        if (this.state.ratings === "") {
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

    handleSubmit = (e) => {
        e.preventDefault();

        var formHTML = e.target;

        console.log(formHTML); // formHTML element

        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
        var formData = new FormData(formHTML);

        console.log(formData);

        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

        /* AJAX request */
        this.ajax(formHTML, formData); // ajax( form, data, destination = null )
    };
    ajax(form, data, destination = null) {
        fetch(form.action, {
            method: form.method, // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit

            headers: {
                // 'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // "Content-Type": "multipart/form-data" // missing boundary
            },

            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client

            body: data, // body data type must match "Content-Type" header
        })
            /* handle return result */
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })

            /* handle success */
            .then((result) => {
                console.log(result);

                this.setState({ result: result });
            })

            /* handle error */
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (
            <form method="post" action="http://abc.top/insert_mod.php">
                <div className="mod">
                    <div className="title__container">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter Title"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="category__container">
                        <label>Category:</label>
                        <select onChange={this.handleChange}>
                            <option value="0">--- Select Category ---</option>
                            {this.state.allCategory.map((cat) => (
                                <option value={cat.categoryid}>
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
                    </div>
                    <div className="thumbnail__container">
                        <label>Thumbnail:</label>
                        <input
                            type="file"
                            name="thnumbnail"
                            onChange={this.uploadthumbnail}
                        />
                    </div>
                    <div className="screenshot__container">
                        <label>Screenshot:</label>
                        <input
                            type="file"
                            name="screenshot"
                            multiple
                            onChange={this.uploadscreenshot}
                        />
                    </div>
                    <div className="description__container">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Enter Description"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="rating__container">
                        <label>Ratings:</label>
                        <select name="rating" onChange={this.handleChange}>
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
                            placeholder="Enter View Count"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="viewdownload__container">
                        <label>Download Count:</label>
                        <input
                            type="number"
                            name="downloadcount"
                            placeholder="Enter Download Count"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="button__container">
                        <button
                            type="submit"
                            className="btn primary"
                            onSubmit={this.handleSubmit}
                        >
                            Add Mod
                        </button>
                        <ToastContainer
                            position="top-center"
                            autoClose={3000}
                            pauseOnHover
                        />
                    </div>
                </div>
            </form>
        );
    }
}
export default Mod;
