const videos = [
    {
        title: 'first video',
        rating: 5,
        comments: 2,
        createdAt: '2 min ago',
    },
    {
        title: 'second video',
        rating: 5,
        comments: 2,
        createdAt: '2 min ago',
    },
    {
        title: 'third video',
        rating: 5,
        comments: 2,
        createdAt: '2 min ago',
    },
];

export const trending = (req, res) => res.render('home', { pageTitle: 'Home', videos });
export const search = (req, res) => res.send('search');
export const upload = (req, res) => res.send('upload');
export const deleteVideo = (req, res) => res.send('delete video');
export const see = (req, res) => res.render('watch');
export const edit = (req, res) => res.send('edit video');