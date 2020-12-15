import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {

    private writeFile(fileName, data): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            fs.writeFile(fileName, data, (err) => 
            {
                if (err)
                {
                    reject(err);    
                }
                else
                {
                    resolve();
                }
            });
        });        
    }
    
    async saveDataUrlAsFile(dataUrl: string): Promise<string> {
        const regex = /^data:.+\/(.+);base64,(.*)$/;

        const matches = dataUrl.match(regex);
        const ext = matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
        await this.writeFile(process.env.BACKEND_FILE_UPLOADS + '/' + randomName + '.' + ext, buffer);
        return randomName;
    }
}
