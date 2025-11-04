import axiosInstance from "../../../helpers/axiosConfig";
import { fav } from "../../../static/api";

export function useFavorite() {
  const fetchFav = async () => {
    const res = await axiosInstance.get(fav);
    return res.data;
  };

  const addToFavorite = async (id) => {
    await axiosInstance.post(`${fav}/${id}`);
  };

  const removeFromFav = async (id) => {
    await axiosInstance.delete(`${fav}/${id}`);
  };

  return { fetchFav, addToFavorite, removeFromFav };
}
