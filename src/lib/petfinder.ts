interface PetfinderAuth {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PetfinderConfig {
  apiKey: string;
  apiSecret: string;
}

export interface PetSearchParams {
  type?: string;
  location?: string;
  distance?: string;
  age?: string;
  size?: string;
  gender?: string;
  coat?: string;
  good_with_children?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
  house_trained?: boolean;
  special_needs?: boolean;
  breed?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface Breed {
  name: string;
  id?: number;
}

export class PetfinderService {
  private config: PetfinderConfig;
  private auth: PetfinderAuth | null = null;
  private authExpiry: number | null = null;

  constructor(config: PetfinderConfig) {
    // Trim any whitespace from credentials
    this.config = {
      apiKey: config.apiKey.trim(),
      apiSecret: config.apiSecret.trim(),
    };
  }

  private async getAuthToken(): Promise<string> {
    try {
      // Check if we have a valid token
      if (this.auth && this.authExpiry && Date.now() < this.authExpiry) {
        return this.auth.access_token;
      }

      const formData = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.apiKey,
        client_secret: this.config.apiSecret,
      });

      // Get new token
      const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get auth token: ${response.status} ${errorText}`);
      }

      const authResponse = (await response.json()) as PetfinderAuth;
      this.auth = authResponse;
      this.authExpiry = Date.now() + (authResponse.expires_in * 1000);
      
      return authResponse.access_token;
    } catch (error) {
      throw error;
    }
  }

  async searchPets(params: PetSearchParams) {
    try {
      const token = await this.getAuthToken();
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.location) queryParams.append('location', params.location);
      if (params.distance) queryParams.append('distance', params.distance);
      if (params.age) queryParams.append('age', params.age);
      if (params.size) queryParams.append('size', params.size);
      if (params.gender) queryParams.append('gender', params.gender);
      if (params.coat) queryParams.append('coat', params.coat);
      if (params.good_with_children) queryParams.append('good_with_children', '1');
      if (params.good_with_dogs) queryParams.append('good_with_dogs', '1');
      if (params.good_with_cats) queryParams.append('good_with_cats', '1');
      if (params.house_trained) queryParams.append('house_trained', '1');
      if (params.special_needs) queryParams.append('special_needs', '1');
      if (params.breed) queryParams.append('breed', params.breed);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`https://api.petfinder.com/v2/animals?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch pets: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getBreeds(type: string): Promise<Breed[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`https://api.petfinder.com/v2/types/${type}/breeds`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch breeds: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.breeds;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a singleton instance
export const petfinderService = new PetfinderService({
  apiKey: process.env.NEXT_PUBLIC_PETFINDER_API_KEY ?? '',
  apiSecret: process.env.NEXT_PUBLIC_PETFINDER_API_SECRET ?? '',
}); 