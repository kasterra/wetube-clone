import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createAt: "desc" })
        .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND" });
    }
    return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found" });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const file = req.file;
    const { title, description, hashtags } = req.body;
    const video = new Video({
        title,
        description,
        fileUrl: file.path,
        createdAt: Date.now(),
        meta: {
            views: 0,
            ratings: 0,
        },
        hashtags: Video.formatHashtags(hashtags),
        owner: _id,
    });
    try {
        await video.save();
        const user = await User.findById(_id);
        user.videos.push(video._id);
        user.save();
    } catch (error) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
    return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findbyId(id);
    if (!video) {
        res.status(404).render("404", { pageTitle: "video not found" });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search", videos });
};
