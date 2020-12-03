import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);
  }
}
