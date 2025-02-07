import { User } from "../app/core/interfaces/user";
import { UserActivity } from "../app/core/interfaces/user-activity";
import { UserAverageSession } from "../app/core/interfaces/user-average";
import { UserData } from "../app/core/interfaces/user-infos.interface";
import { UserPerformances } from "../app/core/interfaces/user-performance";

const createUserData = (
  data: UserData,
  activity: UserActivity,
  performances: UserPerformances,
  average: UserAverageSession
): User => {
  return {
    data: {
      id: data.id,
      userInfos: {
        firstName: data.userInfos.firstName,
        lastName: data.userInfos.lastName,
        age: data.userInfos.age,
      },
      todayScore: data.todayScore,
      keyData: {
        calorieCount: data.keyData.calorieCount,
        proteinCount: data.keyData.proteinCount,
        carbohydrateCount: data.keyData.carbohydrateCount,
        lipidCount: data.keyData.lipidCount,
      },
    },
    activity: {
      userId: activity.userId,
      sessions: activity.sessions,
    },
    performances: {
      userId: performances.userId,
      kind: performances.kind,
      data: performances.data,
    },

    averageSession: {
      userId: average.userId,
      sessions: average.sessions,
    },
  };
};

export const getAllUserData = async (type: string, userId?: string) => {
  if (type === "api") {
    try {
      const data = await Promise.all([
        fetch(`http://localhost:3000/user/${userId}`),
        fetch(`http://localhost:3000/user/${userId}/activity`),
        fetch(`http://localhost:3000/user/${userId}/performance`),
        fetch(`http://localhost:3000/user/${userId}/average-sessions`),
      ]);

      const status = await Promise.all(data.map((response) => response.status));
      if (status.some((status) => status !== 200)) {
        throw new Error();
      }

      const res = await Promise.all(data.map((response) => response.json()));
      
      return createUserData(res[0].data, res[1].data, res[2].data, res[3].data);
    } catch {
      throw new Error();
    }
  } else if (type === "local") {
    try {
      
      const data = await Promise.all([
        fetch(`/user-data-${userId}.json`),
        fetch(`/user-activity-${userId}.json`),
        fetch(`/user-performances-${userId}.json`),
        fetch(`/user-average-sessions-${userId}.json`),
      ]);

      const status = await Promise.all(data.map((response) => response.status));
      if (status.some((status) => status !== 200)) {
        throw new Error();
      }

      const res = await Promise.all(data.map((response) => response.json()));
      
      return createUserData(res[0], res[1], res[2], res[3]);
    } catch {
      throw new Error();
    }
  }
};
