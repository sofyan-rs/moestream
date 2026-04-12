import { ApiClient } from "@/src/constants/api-url";

export type TOngoingSeries = {
  title: string;
  thumb: string;
  latest_episode: string | null;
  updated_on: string;
  updated_day: string;
  endpoint: string;
};

export interface IOngoingResponse {
  status: boolean;
  message: string;
  ongoing: TOngoingSeries[];
}

export const getOngoing = async ({
  page = 1,
}: {
  page: number;
}): Promise<IOngoingResponse> => {
  try {
    const response = await ApiClient.get(`/ongoing/${page}`);
    return response.data as IOngoingResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
