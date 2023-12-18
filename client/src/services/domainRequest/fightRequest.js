import { get, post } from "../requestHelper";

const entity = "fights";

export const getFights = async () => {
  return await get(entity);
};

export const createFights = async (body) => {
  return await post(entity, body);
};
