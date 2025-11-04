import axiosInstance from "../../../helpers/axiosConfig";
import { mostFav } from "../../../static/api";

export function useMostFavorite() {
  const fetchMostFav = async (page = 1) => {
    const res = await axiosInstance.get(`${mostFav}?page=${page}`);
    return res.data;
  };

  return { fetchMostFav };
}
