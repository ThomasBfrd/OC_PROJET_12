export interface UserData {
  id: number;
  userInfos: UserPersonnal;
  todayScore: number;
  keyData: KeyData;
}

export interface UserPersonnal {
  firstName: string;
  lastName: string;
  age: number;
}

export interface KeyData {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}
