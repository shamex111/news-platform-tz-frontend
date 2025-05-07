export interface INews {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      email: string;
    };
    images: string[];
    files: string[];
    createdAt: string;
  }

  