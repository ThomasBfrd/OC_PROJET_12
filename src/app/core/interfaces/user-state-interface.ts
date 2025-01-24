import { UserActivity } from "./user-activity";
import { UserAverageSession } from "./user-average";
import { UserData } from "./user-infos.interface";
import { UserPerformances } from "./user-performance";

export interface UserState {
    localAllData: {
      data: UserData[] | null;
      activity: UserActivity[] | null;
      performances: UserPerformances[] | null;
      averageSession: UserAverageSession[] | null;
    };
    apiAllData: {
      data: UserData[] | null;
      activity: UserActivity[] | null;
      performances: UserPerformances[] | null;
      averageSession: UserAverageSession[] | null;
    };
    dataSource: "local" | "api";
    status: "idle" | "loading" | "succeeded" | "failed";
    userId: string;
  }