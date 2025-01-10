import { UserActivity } from "./user-activity";
import { UserAverageSession } from "./user-average";
import { UserInfos } from "./user-infos.interface";
import { UserPerformances } from "./user-performance";

export interface User {
    userInfos: UserInfos;
    userAverage: UserAverageSession;
    userActivity: UserActivity;
    userPerformances: UserPerformances
}