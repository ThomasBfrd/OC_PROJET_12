export interface UserActivity {
    userId: number
    sessions: Array<Session>
  }
  
  export interface Session {
    day: string
    kilogram: number
    calories: number
  }