export interface AnnouncementPreview {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  admin: {
    name: string;
  };
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  adminId: string;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  adminId?: string;
}
