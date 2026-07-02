import * as fs from 'fs';
import * as path from 'path';

interface SiteData {
  timestamp: string;
  siteName: string;
  url: string;
}

export class FileSaver {
  private static dataDir = path.join(process.cwd(), 'test-data');
  
  /**
   * Save site information to a file with timestamp
   * @param siteName - The name of the site
   * @param fileName - Optional custom file name (default: 'created-sites.json')
   */
  static async saveSiteData(siteName: string, fileName: string = 'created-sites.json'): Promise<void> {
    // Create directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    const filePath = path.join(this.dataDir, fileName);
    const timestamp = new Date().toISOString();
    const url = `https://euacerdev.sharepoint.com/sites/${siteName}`;

    const newEntry: SiteData = {
      timestamp,
      siteName,
      url
    };

    let existingData: SiteData[] = [];

    // Read existing data if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      try {
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Could not parse existing file, starting fresh');
        existingData = [];
      }
    }

    // Append new entry
    existingData.push(newEntry);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    
    console.log(`Site saved to ${filePath}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`URL: ${url}`);
  }
}
