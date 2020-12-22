import Axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parse from "html-react-parser";
import { connect } from "react-redux";

import {
    fetchMod,
    fetchModById,
    fetchAllFileImage,
    deleteMod,
} from "../../store/actions/seedAction";
import { fetchCategory } from "./../../store/actions/categoryAction";

class SeedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileCount: 0,
            thumbCount: 0,
            screenshotCount: 0,

            modalItem: null,
        };
    }

    openModal = (item) => {
        this.setState({ modalItem: item });
    };
    closeModal = () => {
        this.setState({ modalItem: null });
    };

    componentDidMount() {
        this.props.fetchCategory();
        this.props.fetchMod();
        this.props.fetchAllFileImage();
    }
    getCategory = (catid) => {
        let cat =
            this.props.allCategory &&
            this.props.allCategory.filter((c) => c.id === catid)[0];

        return !cat ? "" : cat.categoryname;
    };
    getFileCount = (file) => {
        // const answer_array = file.length > 0 ? 1 : 0;
        // return answer_array + " files";
    };
    getThumbCount = (thumb) => {
        const answer_array = thumb.length > 0 ? 1 : 0;
        return answer_array + " thumbnails";
    };
    getScreenshotCount = (screen) => {
        const answer_array = screen.split(",");
        return answer_array.length + " screenshots";
    };
    getDescription(desc) {
        return desc.length > 300 ? desc.substring(0, 300) + "..." : desc;
    }
    editMod = (path, id) => {
        this.props.fetchModById(id);
        this.props.history.push({
            pathname: path + `/${id}`,
            state: {
                modid: id,
            },
        });
    };

    deleteMod = (id) => {
        if (window.confirm("Are you sure to delete this Seed?")) {
            this.props.deleteMod(id);
            toast("Seed deleted successfully", {
                className: "error__message__modal",
            });
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="mod__list">
                    <table>
                        <tr>
                            <td>Title</td>
                            <td>Category</td>
                            <td>Seed</td>
                            <td>Thumbnail</td>
                            <td>Screenshot</td>
                            <td>Desc</td>
                            <td>Ratings</td>
                            <td>ViewCount</td>
                            <td>DL Count</td>
                            <td>Action</td>
                        </tr>
                        {this.props.allSeeds &&
                        this.props.allSeeds.length > 0 ? (
                            this.props.allSeeds.map((mod, index) => (
                                <tr key={index}>
                                    <td>{mod.title}</td>
                                    <td>{this.getCategory(mod.categoryid)}</td>
                                    <td>{mod.seed}</td>
                                    <td>
                                        {this.props.allFileImages &&
                                            this.props.allFileImages.filter(
                                                (x) =>
                                                    x.modtypeid === mod.id &&
                                                    x.modtype === "seed" &&
                                                    x.field === "thumb"
                                            ).length}
                                    </td>
                                    <td>
                                        {this.props.allFileImages &&
                                            this.props.allFileImages.filter(
                                                (x) =>
                                                    x.modtypeid === mod.id &&
                                                    x.modtype === "seed" &&
                                                    x.field === "screen"
                                            ).length}
                                    </td>
                                    <td>
                                        {parse(
                                            this.getDescription(mod.description)
                                        )}
                                    </td>
                                    <td>{mod.ratings}</td>
                                    <td>{mod.viewcount}</td>
                                    <td>{mod.downloadcount}</td>
                                    <td>
                                        <button
                                            className="action__button edit__btn"
                                            // onClick={() => this.openModal(mod)}
                                            onClick={() =>
                                                this.editMod(
                                                    "/editseed",
                                                    mod.id
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action__button delete__btn"
                                            onClick={() =>
                                                this.deleteMod(mod.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <ToastContainer
                                            position="top-center"
                                            autoClose={3000}
                                            pauseOnHover
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">
                                    No Seed Found. Please add some Seeds
                                </td>
                            </tr>
                        )}
                    </table>
                </div>
                {/* {this.state.modalItem && (
                    <div classname="mod__container__modal">
                        <Modal isOpen={true} onRequestClose={this.closeModal}>
                            <button
                                className="close-modal"
                                onClick={this.closeModal}
                            >
                                x
                            </button>
                            <EditMod mod={this.state.modalItem} />
                        </Modal>
                    </div>
                )} */}
            </React.Fragment>
        );
    }
}
export default withRouter(
    connect(
        (state) => ({
            allCategory: state.allCategory.allCategory,
            allSeeds: state.allSeeds.allSeeds,
            allFileImages: state.allSeeds.allFileImages,
        }),
        {
            fetchCategory,
            fetchMod,
            fetchModById,
            fetchAllFileImage,
            deleteMod,
        }
    )(SeedList)
);
