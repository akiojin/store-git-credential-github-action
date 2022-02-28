import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import * as execa from 'execa'
import { Security } from './Security2'
import { FileSystem } from './FileSystem2'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'

var EnableLoginUserKeychain = async function() {
	await Security.EnableUserKeychains("~/Library/Keychains/login.keychain-db");
}

var GetTemporaryShellScript = async function(text) {
	const src = await FileSystem.GetTemporaryFile(text);
	const dst = `${src}.sh`;

	await fsPromises.rename(src, dst);
	await exec.exec(`chmod +x ${dst}`)

	return dst;
};

var Execute = async function(command) {
	await execa.execa(command);
};

async function Run()
{
	if (process.platform !== 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await EnableLoginUserKeychain();
		await Credential.Store(core.getInput('username'), core.getInput('password'));
//		await GetGitCredential();
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

Run();