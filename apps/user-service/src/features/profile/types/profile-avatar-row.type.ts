export interface ProfileAvatarRow {
  login: string;
  email: string;
  age: number;
  description: string;
  avatarFileName: string | null;
  avatarCreatedAt: Date | null;

  totalCount?: number;
}
