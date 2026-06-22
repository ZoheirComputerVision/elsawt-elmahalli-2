export interface AdWithIncludes {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  position: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdFilter {
  position?: string;
  status?: string;
  search?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
}
