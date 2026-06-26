import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.resolve(__dirname, '../../test-data.json');

export function saveWorkGroupName(name: string): void {
  const data = { workGroupName: name };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getWorkGroupName(): string {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('No saved work group name found. Run the creation test first.');
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  return data.workGroupName;
}

export function saveTaskForceName(name: string): void {
  const data = { taskForceName: name };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getTaskForceName(): string {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('No saved task force name found. Run the creation test first.');
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  return data.taskForceName;
}
