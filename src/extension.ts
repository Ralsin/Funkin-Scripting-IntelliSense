import * as vscode from 'vscode';
import * as Data from './data';

let list: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>;

export async function activate(context: vscode.ExtensionContext) {
	await Data.init();
	console.log('[FunkinLua Autocomplete] (Lua) - Loaded a total of...')
	console.log(Data.ScriptsData.Lua.events.size + ' Events')
	console.log(Data.ScriptsData.Lua.functions.size + ' Functions')
	console.log(Data.ScriptsData.Lua.variables.size + ' Variables')
	console.log(Data.ScriptsData.Lua.snippets.size + ' Snippets')
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
		provideCompletionItems: async function () {
			if (typeof(list) === 'undefined' && typeof(Data.ScriptsData) !== 'undefined') {
				list = [];
				Data.ScriptsData.Lua.variables.forEach((v, k) => {
					const compi = new vscode.CompletionItem(k, vscode.CompletionItemKind.Variable);
					compi.detail = v.returns;
					compi.documentation = new vscode.MarkdownString().appendMarkdown(formatIntoDocs(v.desc, v.example));
					// @ts-ignore
					list.push(compi);
				});
				Data.ScriptsData.Lua.functions.forEach((v, k) => {
					const peppinospagetti = v.argsNames === undefined ? k + '()' : k + '(' + v.argsNames + ')';
					const pipatowel = v.argsString === undefined ? k + '()' : k + '(' + v.argsString + ')';
					const compi = new vscode.CompletionItem(peppinospagetti, vscode.CompletionItemKind.Function);
					compi.detail = (v.returns || 'void') + ' ' + pipatowel;
					compi.insertText = peppinospagetti;
					compi.documentation = new vscode.MarkdownString().appendMarkdown(formatIntoDocs(v.desc, v.example));
					// @ts-ignore
					list.push(compi);
				});
				Data.ScriptsData.Lua.events.forEach((v, k) => {
					const peppinospagetti = v.argsNames === undefined ? k + '()' : k + '(' + v.argsNames + ')';
					const pipatowel = v.argsString === undefined ? k + '()' : k + '(' + v.argsString + ')';
					const compi = new vscode.CompletionItem(peppinospagetti, vscode.CompletionItemKind.Event);
					compi.detail = 'Event: '+pipatowel;
					compi.insertText = new vscode.SnippetString('function ' + peppinospagetti + '\n\t$0\nend');
					compi.documentation = new vscode.MarkdownString().appendMarkdown(formatIntoDocs(v.desc, v.example));
					// @ts-ignore
					list.push(compi);
				});
				Data.ScriptsData.Lua.snippets.forEach((v, k) => {
					const compi = new vscode.CompletionItem(k, vscode.CompletionItemKind.Snippet);
					compi.insertText = new vscode.SnippetString(v);
					// @ts-ignore
					list.push(compi);
				});
			}
			return list;
		}
	}));
}

function formatIntoDocs(description: string, example: string, returnValue?: string) {
	let gay: string[] = [];
	if (description !== undefined) gay.push(description.toString());
	if (example !== undefined) gay.push('Example: `' + example.toString() + '`');
	if (returnValue !== undefined) gay.push('Returns **' + returnValue.toString() + '**');
	return gay.join('\n\n');
}

export function deactivate() {
	list = undefined;
}