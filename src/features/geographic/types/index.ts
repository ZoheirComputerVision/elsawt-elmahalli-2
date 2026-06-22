export interface WilayaWithStats {
  id: string;
  name: string;
  slug: string;
  code: number;
  active: boolean;
  dairasCount: number;
  communesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DairaWithStats {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  wilayaId: string;
  wilayaName: string;
  communesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommuneWithParent {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  dairaId: string;
  dairaName: string;
  wilayaName: string;
  createdAt: Date;
  updatedAt: Date;
}
