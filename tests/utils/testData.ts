import * as fs from 'fs';
import * as path from 'path';

//not sure nees this line
const DATA_FILE = path.resolve(__dirname, '../../test-data.json');


const MANUAL_DATA_FILE = path.resolve(__dirname, '../../manual-test-data.json');

/**
 * Load manual test data from JSON file
 */
export function getManualTestData() {
  if (!fs.existsSync(MANUAL_DATA_FILE)) {
    throw new Error(`Manual test data file not found at ${MANUAL_DATA_FILE}`);
  }
  return JSON.parse(fs.readFileSync(MANUAL_DATA_FILE, 'utf-8'));
}



//not sure nees these
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
