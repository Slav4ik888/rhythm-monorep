import axios from 'axios';

export async function serviceGoogleGetData(url: string): Promise<string | undefined> {
  const response = await axios.get(url);

  return response.data;
};
