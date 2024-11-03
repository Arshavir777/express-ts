import axios, { AxiosInstance } from 'axios';
import { Service } from 'typedi';
import { skinPortConfig } from '../config/skin-port.config';
import { SkinPortItem } from '../model';
import { HttpError } from 'routing-controllers';

@Service()
export class SkinPortProvider {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: skinPortConfig.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async fetchItems(
    appId: number = skinPortConfig.defaultAppId,
    currency: string = skinPortConfig.defaultCurrency,
    tradable: boolean = false
  ): Promise<SkinPortItem[]> {
    try {
      const response = await this.client.get('/items', {
        params: {
          app_id: appId,
          currency: currency,
          tradable: tradable,
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const skinPortErrors = error.response.data?.errors;
        const message = skinPortErrors[0]?.message || 'Failed to fetch items';
        throw new HttpError(error.response.status, message);
      } else if (error.request) {
        throw new HttpError(504, 'No response from the API server');
      } else {
        throw new HttpError(500, 'An unexpected error occurred while making the API request');
      }
    } else {
      throw new HttpError(500, 'An unexpected error occurred');
    }
  }
}
