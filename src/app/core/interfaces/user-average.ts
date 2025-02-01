export interface UserAverageSession {
    userId: number
    sessions: Array<AverageSession>
  }
  
  export interface AverageSession {
    day: number
    sessionLength: number
  }