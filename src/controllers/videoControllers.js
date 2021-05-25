let videos = [
  {
    title: "first video",
    rating: 5,
    comments: 2,
    createdAt: "2 min ago",
    id: 1,
    views: 1,
  },
  {
    title: "second video",
    rating: 5,
    comments: 2,
    createdAt: "2 min ago",
    id: 2,
    views: 2,
  },
  {
    title: "third video",
    rating: 5,
    comments: 2,
    createdAt: "2 min ago",
    id: 3,
    views: 3,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const search = (req, res) => res.send("search");
export const deleteVideo = (req, res) => res.send("delete video");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    createdAt: "Just Now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
