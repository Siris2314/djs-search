
const vscode = require('vscode');
const axios = require('axios');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('discord-search.search', async function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if(!editor){
			vscode.window.showInformationMessage('Editor does not exist');
			return; 
		}

		const input = editor.document.getText(editor.selection)
	try{
		const data = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(input)}`)
		if(!data.data.fields){
			return vscode.window.showInformationMessage('Please use a relevant Discord Object, i.e. Message, MessageEmbed, Client etc. ');
		}
	else{
		vscode.window.showInformationMessage(`Documentation information on ${input}: ${data.data.url}`);
		let newarr = []
        let arr = Object.values(data.data.fields[0])
		if(!arr) return;
        newarr = arr.splice(1,2)[0].replace(/`/g, "").split(' ')
		const quickPick = vscode.window.createQuickPick()
		
		quickPick.items = newarr.map(
			(x) => ({label: x}),
			);

		quickPick.onDidAccept(() => {
			
			const item = quickPick.selectedItems[0];
			if(item){
				const panel = vscode.window.createWebviewPanel(
					'discord-search',
					item.label,
					vscode.ViewColumn.One,
					{
						enableScripts: true
					}
				);


				console.log(item.label)

				function getWebviewContent() {
					return `<!DOCTYPE html>
					<html>
					<body>
					
				
					<iframe src=${data.data.url}?scrollTo=${item.label} title="Channel ID" allowFullScreen = true  width="100%" height="800">
					</iframe>




					<script>
					function getIframeContent(frameID) {
						var frameObj = 
							document.getElementById(frameID);
						var frameContent = frameObj
							.contentWindow.document.body.innerHTML;
			  
						alert("frame content : " + frameContent);
					}
				</script>

				

					
					</body>
					</html>`;
				  }

				
				  
		  		panel.webview.html = getWebviewContent();	
				// vscode.window.showInformationMessage(item.label)
				quickPick.dispose();
			}

		
		})
	

		// quickPick.onDidChangeSelection(([item]) => {
		// 	if(item){
		// 		vscode.window.showInformationMessage(item.label)

		// 		quickPick.dispose();

		// 	}
		// })
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}

		} catch (error) {
			console.log(error);
			return vscode.window.showInformationMessage('Please use a relevant Discord Object, i.e. Message, MessageEmbed, Client etc. ');
		}
		

	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}


