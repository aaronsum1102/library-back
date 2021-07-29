import { spawn } from 'child_process';
import EventEmitter from 'events';
import chalk from 'chalk';

interface Command {
  command: string;
  name: string;
  readyLog?: string;
}

const eventEmitter = new EventEmitter();

const logInfo = (message: string, name: string) => {
  console.log(chalk.cyan.bold(name), message);
};

const runCommand = (commandData: Command) => {
  const process = spawn(commandData.command, { shell: true });

  process.stdout.on('data', (data) => {
    logInfo(`${data}`, commandData.name);

    if (commandData.readyLog && typeof data === 'string' && data.includes(commandData.readyLog)) {
      eventEmitter.emit(`${commandData.name}Ready`);
    }
  });

  process.stderr.on('data', (data) => {
    logInfo(`${data}`, commandData.name);
    eventEmitter.emit(`${commandData.name}Error`);

    if (commandData.readyLog && data.includes(commandData.readyLog)) {
      eventEmitter.emit(`${commandData.name}Ready`);
    }
  });

  process.on('exit', () => {
    eventEmitter.emit(`${commandData.name}Exit`);
  });

  return process;
};

const commands: Record<string, Command> = {
  server: {
    command: 'yarn start',
    name: 'server',
    readyLog: 'Ready!'
  },
  codegen: {
    command: 'yarn codegen',
    name: 'codegen'
  },
  tsc: {
    command: 'yarn tsc --noemit --skipLibCheck',
    name: 'tsc'
  },
  prettier: {
    command: 'yarn prettier --write "src/generated/**/*.ts"',
    name: 'prettier'
  }
};

const processes: Record<string, ReturnType<typeof spawn>> = {};

processes[commands.server.name] = runCommand(commands.server);

eventEmitter.on('serverReady', () => {
  processes[commands.codegen.name] = runCommand(commands.codegen);
});

eventEmitter.on('codegenExit', () => {
  processes[commands.tsc.name] = runCommand(commands.tsc);
});

eventEmitter.on('tscExit', () => {
  processes[commands.prettier.name] = runCommand(commands.prettier);
});

eventEmitter.on('prettierExit', () => {
  commands.server.name in processes && processes[commands.server.name].kill('SIGTERM');
});
