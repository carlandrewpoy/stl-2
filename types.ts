import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type ICombination = {
  id: string;
  number: string;
  bet: string;
  game: null;
  time: null;
  rumble: boolean;
};

export type IAddReturn = {
  success: ISuccess;
};

export type ISuccess = {
  transaction_code: string;
  agent_name: string;
  game_type: string;
  draw_date: string;
  draw_time: string;
  bet_time: string;
  combinations: ISuccessCombination[];
  total: Float;
};

export type ISuccessCombination = {
  game_type: string;
  combination: string;
  bet: string;
  rumble: number;
};

export type IReports = {
  twoD: IGame;
  threeD: IGame;

  fourD: IFourGame;
  total: 1288;
};

export type IGame = {
  combinationCounts: number;
  total: number;
  twoPm: {
    combinationCounts: 2;
    total: number;
  };
  fivePm: {
    combinationCounts: number;
    total: number;
  };
  ninePm: {
    combinationCounts: number;
    total: number;
  };
};

export type IFourGame = {
  combinationCounts: 1;
  total: 34;
  ninePm: INinePM;
};

export type INinePM = {
  combinationCounts: number;
  total: number;
};

export type IResults = {
  twoD: {
    twoPm: {
      result: string;
      wins: number;
    };
    fivePm: {
      result: string;
      wins: number;
    };
    ninePm: {
      result: string;
      wins: number;
    };
  };
  threeD: {
    twoPm: {
      result: string;
      wins: number;
    };
    fivePm: {
      result: string;
      wins: number;
    };
    ninePm: {
      result: string;
      wins: number;
    };
  };
  fourD: {
    ninePm: {
      result: string;
      wins: number;
    };
  };
  totalWins: number;
};

export type ILogin = {
  success: IloginSuccess;
  token: string;
};

export type IloginSuccess = {
  id: number;
  first_name: String;
  middle_name: String;
  last_name: String;
  isAdmin: number;
  isSuperAdmin: number;
  area_name: String;
  location: number;
  username: string;
  phone_number: string;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
};

// export type IloginSuccess = {
//   id: 2;
//   complete_name: string;
//   isAdmin: string;
//   area_name: string;
//   location: string;
//   username: string;
//   phone_number: string;
//   status: 1;
//   deleted_at: null;
//   created_at: null;
//   updated_at: string;
// };
