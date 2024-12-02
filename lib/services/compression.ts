'use client';

import LZString from 'lz-string';

export class CompressionService {
  static compress(data: unknown): string {
    try {
      const jsonString = JSON.stringify(data);
      return LZString.compressToUTF16(jsonString);
    } catch (error) {
      console.error('Compression error:', error);
      throw error;
    }
  }

  static decompress<T = unknown>(compressed: string): T | null {
    try {
      const jsonString = LZString.decompressFromUTF16(compressed);
      return jsonString ? JSON.parse(jsonString) as T : null;
    } catch (error) {
      console.error('Decompression error:', error);
      throw error;
    }
  }

  static async compressBlob(blob: Blob): Promise<string> {
    try {
      const buffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      const chars = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      return LZString.compressToUTF16(chars);
    } catch (error) {
      console.error('Blob compression error:', error);
      throw error;
    }
  }

  static decompressToBlob(compressed: string, type: string = 'image/png'): Blob {
    try {
      const decompressed = LZString.decompressFromUTF16(compressed);
      if (!decompressed) throw new Error('Decompression failed');
      
      const uint8Array = new Uint8Array(
        decompressed.split('').map(char => char.charCodeAt(0))
      );
      return new Blob([uint8Array], { type });
    } catch (error) {
      console.error('Blob decompression error:', error);
      throw error;
    }
  }
}