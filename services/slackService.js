import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;

console.log('Slack token:', SLACK_TOKEN);


const buildModal = () => ({
  type: 'modal',
  title: { type: 'plain_text', text: 'Request Approval' },
  callback_id: 'approval_modal',
  submit: { type: 'plain_text', text: 'Submit' },
  close: { type: 'plain_text', text: 'Cancel' },
  blocks: [
    {
      type: 'input',
      block_id: 'approver_block',
      label: { type: 'plain_text', text: 'Select Approver' },
      element: {
        type: 'users_select',
        action_id: 'user_select'
      }
    },
    {
      type: 'input',
      block_id: 'text_block',
      label: { type: 'plain_text', text: 'Approval Request' },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'text_input'
      }
    }
  ]
});

const openModal = async (triggerId, modal) => {
  try {
    const response = await axios.post('https://slack.com/api/views.open', {
      trigger_id: triggerId,
      view: modal
    }, {
      headers: {
        Authorization: `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.ok) {
      console.error('Error opening modal:', response.data.error);
    } else {
      console.log('Modal opened successfully');
    }
  } catch (err) {
    console.error('Failed to open modal:', err);
  }
};


const sendApprovalRequest = async (approver, requester, text) => {
  console.log(`Sending approval request to ${approver} from ${requester}: "${text}"`);

  await axios.post('https://slack.com/api/chat.postMessage', {
    channel: approver,
    text: `New approval request: "${text}"`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*Approval Request*\n${text}` } },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Approve' },
            style: 'primary',
            action_id: 'approve',
            value: JSON.stringify({ requester, text })
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Reject' },
            style: 'danger',
            action_id: 'reject',
            value: JSON.stringify({ requester, text })
          }
        ]
      }
    ]
  }, {
    headers: {
      Authorization: `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
};

const notifyRequester = async (userId, message) => {
  await axios.post('https://slack.com/api/chat.postMessage', {
    channel: userId,
    text: message
  }, {
    headers: {
      Authorization: `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
};

export default {
  buildModal,
  openModal,
  sendApprovalRequest,
  notifyRequester
};
