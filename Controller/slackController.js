
import slackService from '../services/slackService.js';
import qs from 'qs';


export const handleSlashCommand = async (req, res) => {
  try {
    const payload = qs.parse(req.body);
    const triggerId = payload.trigger_id;
    const modal = slackService.buildModal();
    await slackService.openModal(triggerId, modal);
    console.log('Modal opened successfully');
  } catch (err) {
    console.error('Failed to open modal:', err);
  }

  res.status(200).send(); // immediate 200 to Slack
};

export const handleInteraction = async (req, res) => {

  const payload = JSON.parse(req.body.payload);

  if (payload.type === 'view_submission') {
    const approver = payload.view.state.values.approver_block.user_select.selected_user;
    const requestText = payload.view.state.values.text_block.text_input.value;
    const requesterId = payload.user.id;
    try {
      await slackService.sendApprovalRequest(approver, requesterId, requestText);
    }
    catch (err) {
      console.error('Failed to close modal:', err);
    }
    return res.status(200).send();
  }

  if (payload.type === 'block_actions') {
    const action = payload.actions[0];
    const { requester, text } = JSON.parse(action.value);

    const decision = action.action_id === 'approve' ? 'Approved' : 'Rejected';
    try {
      await slackService.notifyRequester(requester, `${decision}: "${text}"`);

    } catch (error) {
      console.error('Error handling block action:', error);
      return res.status(500).send('Internal Server Error');

    }
    return res.status(200).send({ text: `You ${decision.toLowerCase()} this request.` });
  }
};

