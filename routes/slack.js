// routes/slack.js
import express from 'express';
import { handleSlashCommand, handleInteraction } from '../Controller/slackController.js';
const router = express.Router();

router.post('/commands', handleSlashCommand);
router.post('/interactions', express.urlencoded({ extended: true }), handleInteraction);

export default router;
