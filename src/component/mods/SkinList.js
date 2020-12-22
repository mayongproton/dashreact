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
} from "../../store/actions/skinAction";
import { fetchCategory } from "./../../store/actions/categoryAction";

class SkinList extends Component {
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
        if (window.confirm("Are you sure to delete this Skin?")) {
            this.props.deleteMod(id);
            toast("Skin deleted successfully", {
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
                            <td>Thumbnail</td>
                            <td>Screenshot</td>
                            <td>Ratings</td>
                            <td>ViewCount</td>
                            <td>DL Count</td>
                            <td>Action</td>
                        </tr>
                        {this.props.allSkins &&
                        this.props.allSkins.length > 0 ? (
                            this.props.allSkins.map((mod, index) => (
                                <tr key={index}>
                                    <td>{mod.title}</td>
                                    <td>{this.getCategory(mod.categoryid)}</td>

                                    <td>
                                        {this.props.allFileImages &&
                                            this.props.allFileImages.filter(
                                                (x) =>
                                                    x.modtypeid === mod.id &&
                                                    x.modtype === "skin" &&
                                                    x.field === "thumb"
                                            ).length}
                                    </td>
                                    <td>
                                        {this.props.allFileImages &&
                                            this.props.allFileImages.filter(
                                                (x) =>
                                                    x.modtypeid === mod.id &&
                                                    x.modtype === "skin" &&
                                                    x.field === "screen"
                                            ).length}
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
                                                    "/editskin",
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
                                <td colSpan="8">
                                    No Skin Found. Please add some Skins
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
            allSkins: state.allSkins.allSkins,
            allFileImages: state.allSkins.allFileImages,
        }),
        {
            fetchCategory,
            fetchMod,
            fetchModById,
            fetchAllFileImage,
            deleteMod,
        }
    )(SkinList)
);
