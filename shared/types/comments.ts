export interface Comment {
  id: string;
  author: {
    avatar: string;
    displayName: string;
  };
  body: string;
  status: string;
  createdAt: string;
}
