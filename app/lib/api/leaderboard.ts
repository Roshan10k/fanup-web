import axios from "./axios";
import { isAxiosError } from "axios";
import { API } from "./endpoints";


const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const getLeaderboardContests = async (status: "upcoming" | "completed") => {
  try {
    const query = new URLSearchParams({ status });
    const response = await axios.get(`${API.LEADERBOARD.CONTESTS}?${query.toString()}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load contests"));
  }
};

export const getMatchLeaderboard = async (token: string, matchId: string) => {
  try {
    const response = await axios.get(API.LEADERBOARD.CONTEST_BY_MATCH(matchId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load leaderboard"));
  }
};

export const getMyContestEntries = async (token: string) => {
  try {
    const response = await axios.get(API.LEADERBOARD.MY_ENTRIES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load my entries"));
  }
};

export const submitContestEntry = async (
  token: string,
  input: {
    matchId: string;
    teamId: string;
    teamName: string;
    captainId?: string;
    viceCaptainId?: string;
    playerIds: string[];
  }
) => {
  try {
    const response = await axios.post(
      API.LEADERBOARD.SUBMIT_ENTRY(input.matchId),
      {
        teamId: input.teamId,
        teamName: input.teamName,
        captainId: input.captainId,
        viceCaptainId: input.viceCaptainId,
        playerIds: input.playerIds,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to submit contest entry"));
  }
};

export const deleteContestEntry = async (token: string, matchId: string) => {
  try {
    const response = await axios.delete(API.LEADERBOARD.SUBMIT_ENTRY(matchId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to delete entry"));
  }
};