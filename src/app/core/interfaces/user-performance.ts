export interface UserPerformances {
    userId: number
    kind: {[key: number]: string};
    data: Array<KindValue>
  }
  
  export interface KindValue {
    value: number
    kind: number
  }

  export enum KindTransform {
    "Cardio" = 1,
    "Energie" = 2,
    "Endurance" = 3,
    "Force" = 4,
    "Vitesse" = 5,
    "Intensité" = 6,
  }
  