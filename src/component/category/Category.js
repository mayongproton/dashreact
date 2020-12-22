import Axios from "axios";
import React, { Component } from "react";
import "./Category.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import Loader from "./../mods/Loader";

import {
    fetchCategory,
    addCategory,
    deleteCategory,
} from "./../../store/actions/categoryAction";

class Category extends Component {
    constructor() {
        super();
        this.state = {
            allCategory: [],
            categoryid: 0,
            categoryname: "",
            isLoading: false,
        };
    }
    componentDidMount() {
        this.props.fetchCategory();
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        const obj = {
            categoryname: this.state.categoryname,
        };
        if (this.state.categoryname !== "") {
            this.props.addCategory(obj);
            toast("Category Added Successfully", {
                className: "success__message",
            });
            setTimeout(() => {
                this.setState({ isLoading: false });
                this.setState({ categoryname: "" });
            }, 3000);
        } else {
            toast("Enter Category and the press Add button", {
                className: "error__message",
            });
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 3000);
        }
    };
    deleteCategory = (id) => {
        if (window.confirm("Are you sure to delete this Category?")) {
            //delete code
            this.props.deleteCategory(id);
        }
    };

    render() {
        return (
            <div>
                {this.state.isLoading && <Loader />}
                <div className="category">
                    <div className="category__input">
                        <label htmlFor="category">Category Name:</label>
                        <input
                            type="text"
                            value={this.state.categoryname}
                            className="input__field"
                            placeholder="Enter Category"
                            name="categoryname"
                            onChange={this.handleChange}
                        />
                        <button
                            type="button"
                            className="btn primary"
                            onClick={this.handleSubmit}
                        >
                            Add Category
                        </button>
                        <ToastContainer
                            position="top-center"
                            autoClose={3000}
                            pauseOnHover
                        />
                    </div>
                    <div className="show__category">
                        <table>
                            <thead>
                                <tr>
                                    <td>SL No #</td>
                                    <td>Category Name</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            {this.props.allCategory &&
                            this.props.allCategory.length > 0 ? (
                                this.props.allCategory.map((cat, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{cat.categoryname}</td>
                                        <td>
                                            <button
                                                className="action__button delete__btn"
                                                onClick={() =>
                                                    this.deleteCategory(cat.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No Category Found</td>
                                </tr>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        allCategory: state.allCategory.allCategory,
    }),
    { fetchCategory, addCategory, deleteCategory }
)(Category);
