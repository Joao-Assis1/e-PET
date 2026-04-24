import axios from 'axios';

const NEON_DATA_API_URL = 'https://ep-gentle-wildflower-anemu70d.apirest.c-6.us-east-1.aws.neon.tech/neondb/rest/v1';

export const neonService = {
  /**
   * Fetches all families directly from Neon
   */
  async getFamilies() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${NEON_DATA_API_URL}/families`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching families from Neon Data API:', error);
      throw error;
    }
  },

  /**
   * Fetches health conditions for an individual
   */
  async getHealthConditions(individualId: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${NEON_DATA_API_URL}/individual_health_conditions`, {
        params: {
          individual_id: `eq.${individualId}`
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching health conditions:', error);
      throw error;
    }
  }
};
