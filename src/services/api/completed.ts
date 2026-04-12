import { ApiClient } from "@/src/constants/api-url";

export type TCompletedSeries = {
  title: string;
  thumb: string;
  total_episode: string;
  updated_on: string;
  score: string;
  endpoint: string;
};

export interface ICompletedResponse {
  status: boolean;
  message: string;
  completed: TCompletedSeries[];
  currentPage: number;
}

export const getCompleted = async ({
  page = 1,
}: {
  page: number;
}): Promise<ICompletedResponse> => {
  try {
    const response = await ApiClient.get(`/completed/${page}`);
    return response.data as ICompletedResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
