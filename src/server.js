import express from 'express';
import morgan from 'morgan';
import globalRouter from './router/globalRouter';
import videoRouter from './router/videoRouter';
import userRouter from './router/userRouter';

const app = express();
const logger = morgan('dev');

const handleListending = () => console.log('Server listening...');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use('/', globalRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

app.listen(4000, handleListending);