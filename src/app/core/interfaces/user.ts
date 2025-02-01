import { UserActivity } from "./user-activity";
import { UserAverageSession } from "./user-average";
import { UserData } from "./user-infos.interface";
import { UserPerformances } from "./user-performance";

export interface User {
  data: UserData[];
  userAverage: UserAverageSession[];
  userActivity: UserActivity[];
  userPerformances: UserPerformances[];
}