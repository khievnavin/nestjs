import * as crypto from 'crypto';

export class Hash {
    // Hash the data
    static hash(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    // Verify by comparing hashes
    static verify(data: string, hashed: string): boolean {
        const dataHash = this.hash(data);
        return dataHash === hashed;
    }
}
