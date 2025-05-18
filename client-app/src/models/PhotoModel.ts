export interface Photo {
  id: number;
  image_url: string;
  caption: string | null;
  issue_id: number;
  taken_at: string | null;
  created_at: string;
}