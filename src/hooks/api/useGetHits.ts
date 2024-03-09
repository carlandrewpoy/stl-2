import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ILogin, IloginSuccess } from "../../../types";

const getAllHits = async (
  token: string,
  game_type: string,
  draw_time: string,
  date: string
) => {
  const BASE_URL = "https://diamonds.up.railway.app/api";
  const response = await axios.post(
    `${BASE_URL}/Agent/Hits`,
    { draw_date: date, game_type: game_type, draw_time: draw_time },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetAllHits = (
  game_type: string,
  draw_time: string,
  date: string
) => {
  const { userInfo } = useContext(AuthContext);
  return useQuery(["allHits", date], () =>
    getAllHits(userInfo.token, game_type, draw_time, date)
  );
};
