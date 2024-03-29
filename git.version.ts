import {writeFileSync} from 'fs';
import {promisify} from 'util';
import * as child from 'child_process';
const exec = promisify(child.exec);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

/**
 * Creates App version file
 */
async function createVersionsFile(filename: string) {
  let revision = process.env.HEROKU_SLUG_DESCRIPTION;
  if (revision) {
    revision = revision.replace('Deploy ', '');
  }
  let branch = process.env.NODE_ENV;

  try {
    revision = (await exec('git rev-parse --short HEAD')).stdout.toString().trim();
    branch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.toString().trim();
  } catch (e) {
    console.error(e);
  }

  console.log(` 🚀 Version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}'`);

  const content = `
      /* tslint:disable */
      // This file was auto-generated with git.version.ts script       
      export const versions = {
        version: '${process.env.npm_package_version}',
        revision: '${revision}',
        branch: '${branch}',
        buildDate: '${moment().format('YYYYMMDD')}',
        buildNumber: '${moment().format('HHmm')}'
      };`;

  writeFileSync(filename, content, {encoding: 'utf8'});
}

createVersionsFile('src/versions.ts').then();
