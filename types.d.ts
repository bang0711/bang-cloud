interface ResponseFromAPI {
  status: number;
  message: string;
  object?: {
    id: string;
    email: string;
    name: string;
    image: string;
  };
}
