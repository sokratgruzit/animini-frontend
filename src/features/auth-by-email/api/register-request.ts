import { $api } from "../../../shared/api";
import { type RegisterSchema } from "../model";

/**
 * Payload for the registration request.
 * We omit confirmPassword as the backend doesn't need it.
 */
type RegisterDto = Omit<RegisterSchema, "confirmPassword">;

/**
 * Sends registration data to the server
 */
export const registerRequest = async (data: RegisterDto) => {
  const response = await $api.post("/registration", data);
  return response.data;
};
