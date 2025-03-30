import { InferSchemaType } from "mongoose";
import User from "../models/UserSchema.mjs";
import { UserDto } from "../models/UserDto.mjs";

type UserType = InferSchemaType<typeof User.schema>;

export const converDbToDto = (dbData: UserType) => {
  return {
    name: dbData.name,
    email: dbData.email,
  } satisfies UserDto;
};
