import dotenv from 'dotenv';
import { spawnSync } from 'child_process';

dotenv.config();


const args = process.argv.slice(2);

spawnSync(args.shift(), args, { stdio: 'inherit', shell: true });