export interface Memory {
  id: string;
  imageUri: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  createdAt: number;
}
