// API service for communicating with the backend

const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lastLogin?: string;
  loginCount?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface VideoMetadata {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  url: string;
  quality: string;
}

class ApiService {
  private token: string | null = null;

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get authentication token
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers for authenticated requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Make authenticated API request
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getProfile(): Promise<User> {
    return await this.makeRequest('/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    return await this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Video methods
  async getVideoMetadata(lessonId: string): Promise<VideoMetadata> {
    return await this.makeRequest(`/videos/metadata/${lessonId}`);
  }

  async getVideoStream(lessonId: string): Promise<{ url: string; quality: string; duration: number }> {
    return await this.makeRequest(`/videos/stream/${lessonId}`);
  }

  async getVideoList(): Promise<VideoMetadata[]> {
    return await this.makeRequest('/videos/list');
  }

  async updateVideoProgress(lessonId: string, progress: number, duration: number): Promise<void> {
    return await this.makeRequest('/videos/progress', {
      method: 'POST',
      body: JSON.stringify({ lessonId, progress, duration }),
    });
  }

  async completeVideo(lessonId: string, courseId: string): Promise<void> {
    return await this.makeRequest('/videos/complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId, courseId }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; database: string; services: any }> {
    return await fetch(`${API_BASE_URL}/health`).then(res => res.json());
  }
}

export default new ApiService();
