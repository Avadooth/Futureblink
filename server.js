import express from 'express';
import bodyParser from 'body-parser';
import slackRoutes from './routes/slack.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/slack', slackRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack bot running on port ${PORT}`));
