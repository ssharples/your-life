
import CryptoJS from 'crypto-js';

class ClientEncryption {
  private static instance: ClientEncryption;
  private encryptionKey: string | null = null;

  private constructor() {}

  static getInstance(): ClientEncryption {
    if (!ClientEncryption.instance) {
      ClientEncryption.instance = new ClientEncryption();
    }
    return ClientEncryption.instance;
  }

  // Generate or retrieve user's encryption key (derived from password or generated)
  setEncryptionKey(password: string, userId: string): void {
    // Derive a consistent key from user password and ID
    this.encryptionKey = CryptoJS.PBKDF2(password, userId, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
  }

  // Generate a random encryption key (for key-based encryption)
  generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  // Encrypt data before sending to backend
  encrypt(data: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  // Decrypt data after receiving from backend
  decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Clear encryption key on logout
  clearKey(): void {
    this.encryptionKey = null;
  }
}

export const encryption = ClientEncryption.getInstance();
