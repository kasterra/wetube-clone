const videos=[]

export const trending = (req, res) => res.render("home",{pageTitle : "Home",videos});
export const search = (req, res) => res.send('search');
export const upload = (req, res) => res.send('upload');
export const deleteVideo = (req, res) => res.send('delete video');
export const see = (req, res) => res.render('watch');
export const edit = (req, res) => res.send('edit video');