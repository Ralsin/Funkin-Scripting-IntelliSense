import * as vscode from 'vscode';
import fetch from 'node-fetch';
// import { readFile } from 'fs';
type LuaData = {
    [key: string]: Map<string, any>,
    events: Map<string, any>,
    functions: Map<string, any>,
    variables: Map<string, any>,
    snippets: Map<string, any>
}
type FunkinData = {
    Lua: LuaData,
    Hscript: undefined
}
let Data: FunkinData = <FunkinData>{}
export async function init() {
    const Engine = vscode.workspace.getConfiguration().get('funkin-scripting-intellisense.scriptingAutocompleteVersion');
    let lua: LuaData = <LuaData>{};
    try {
        const luaData = await fetch(`https://raw.githubusercontent.com/Ralsin/Funkin-Scripting-IntelliSense/main/data/v0/${Engine}/Lua.json`);
        if (luaData.status === 200) {
            lua = await luaData.json();
        } else throw new Error('Failed to retrieve data from GitHub repo! Status: '+luaData.status);
    } catch (e) {
        // console.log('Failed to retrieve data from GitHub repo!\nError: ' + e + '\nLoading internal data which may be outdated...');
        // readFile(`../data/v0/${Engine}/Lua.json`, { encoding: 'utf8' }, (_, data) => lua = JSON.parse(data));
        throw new Error('Failed to retrieve data from GitHub repo!\nError: ' + e);
    }
    Data.Lua = {
        events: new Map(Object.entries(lua.events)),
        functions: new Map(Object.entries(lua.functions)),
        variables: new Map(Object.entries(lua.variables)),
        snippets: new Map(Object.entries(lua.snippets))
    };
    for (const thing of ['events', 'functions', 'snippets']) {
        Data.Lua[thing].forEach((v) => {
            if (v.args === undefined) return;
            let argsNames: string[] = [];
            let argsString: string[] = [];
            for (const stinky of Object.entries(v.args)) {
                argsNames.push(stinky[0]);
                argsString.push(`${stinky[0]}: ${stinky[1]}`);
            }
            v.argsNames = argsNames.join(', ');
            v.argsString = argsString.join(', ');
        });
    }
}
export let ScriptsData = Data;