import express from 'express';
import { upload, edit, deleteVideo,see } from '../controllers/videoControllers';
const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send('watch viedo');

videoRouter.get('/upload', upload);
videoRouter.get('/:id(\\d+)', see);
videoRouter.get('/:id(\\d+)/edit', edit);
videoRouter.get('/:id(\\d+)/delete', deleteVideo);

export default videoRouter;