import { NetworkStatus, CoveragePoint } from '@/lib/types/network';

class APIClient {
  private static instance: APIClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  async submitCoverageReport(point: CoveragePoint): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/coverage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(point),
      });

      if (!response.ok) {
        throw new Error('Failed to submit coverage report');
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async getCoveragePoints(): Promise<CoveragePoint[]> {
    try {
      const response = await fetch(`${this.baseURL}/coverage`);
      if (!response.ok) {
        throw new Error('Failed to fetch coverage points');
      }
      return response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
}

export const apiClient = APIClient.getInstance();