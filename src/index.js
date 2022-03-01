import * as core from '@actions/core'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'

async function Run()
{
	core.notice('Running');

	if (process.platform !== 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		core.notice('1');
		await Credential.Configure();
		core.notice('2');
		await Credential.Store(core.getInput('username'), core.getInput('password'));
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

async function Cleanup()
{
	core.notice('Cleanup');

	try {
		await Credential.Erase();
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

const IsPost = !!process.env['STATE_IsPost']

if (!!IsPost) {
	Cleanup();
} else {
	Run();
}

if (!IsPost) {
	coreCommand.issueCommand('save-state', { name: 'IsPost' }, 'true')
}
