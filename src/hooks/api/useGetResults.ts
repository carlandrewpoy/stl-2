import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ILogin, IloginSuccess } from "../../../types";

const getAllResults = async (token: string, date: string) => {
  const BASE_URL = "https://diamonds.up.railway.app/api";
  const response = await axios.post(
    `${BASE_URL}/Agent/Results`,
    { draw_date: date },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetAllResults = (date: string) => {
  const { userInfo } = useContext(AuthContext);
  return useQuery(["allResults", date], () =>
    getAllResults(userInfo.token, date)
  );
};
