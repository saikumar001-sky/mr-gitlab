const vscode = require('vscode');
const axios = require('axios');

let timer;

function activate(context) {
  console.log('GitLab MR Alert extension is active.');

  const startCommand = vscode.commands.registerCommand('mr-gitlab.start', () => {
    vscode.window.showInformationMessage('GitLab MR Alert started.');
    
    timer = setInterval(async () => {
      const mergeRequests = await getMergeRequests();
      mergeRequests.forEach(mr => showNotification(mr));
    }, 2000); // Poll every minute
  });

  const stopCommand = vscode.commands.registerCommand('mr-gitlab.stop', () => {
    clearInterval(timer);
    vscode.window.showInformationMessage('GitLab MR Alert stopped.');
  });

  context.subscriptions.push(startCommand, stopCommand);
}

function deactivate() {
  clearInterval(timer);
}

const getMergeRequests = async () => {
  try {
    const response = await axios.get('http://gitlab.softdevels.com/api/v4/merge_requests', {
      headers: { 'Authorization': `Bearer glpat-gZptXjzSAZEnpsBUqkMz` }
    });
    return response.data.filter(mr => mr.state === 'opened'); // Only open MRs
  } catch (error) {
    console.error(error);
    return [];
  }
};

const showNotification = (mr) => {
  vscode.window.showInformationMessage(`New Merge Request: ${mr.title}`, 'View', 'Ignore')
    .then(selection => {
		console.log("mr=====>",mr)
      if (selection === 'View') {
		
        vscode.env.openExternal(vscode.Uri.parse(mr.web_url));
      }
    });
};

module.exports = { activate, deactivate };