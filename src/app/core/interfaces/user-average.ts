export interface UserAverageSession {
    userId: number
    sessions: Array<AverageSession>
  }
  
  export interface AverageSession {
    day: number
    sessionLength: number
  }

  export enum dayTransform {
    "L" = 1,
    "M" = 2,
    "M2" = 3,
    "J" = 4,
    "V" = 5,
    "S" = 6,
    "D" = 7  
  }
  