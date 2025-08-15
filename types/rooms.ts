export interface RoomDoc {
  $id: string;
  name: string;
  description?: string;
  capacity?: number;
  sqft?: number;
  location?: string;
  address?: string;
  availability?: string;
  price_per_hour?: number;
  amenities?: string;
  image?: string;
  user_id: string;
}
