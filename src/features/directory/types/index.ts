export interface DirectoryEntryWithIncludes {
  id: string;
  name: string;
  category: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  imageUrl: string | null;
  status: string;
  featured: boolean;
  contactName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectoryFilter {
  category?: string;
  city?: string;
  province?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}
