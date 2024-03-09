import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ILogin, IloginSuccess } from "../../../types";

const claimHits = async (token: string, code: string) => {
  const BASE_URL = "https://adminstlv2.up.railway.app/api";
  const response = await axios.post(
    `${BASE_URL}/Agent/Hits/claim`,
    { draw_code: code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useClaimHits = (code: string) => {
  const { userInfo } = useContext(AuthContext);
  return useQuery(["claimHits", code], () => claimHits(userInfo.token, code));
};
