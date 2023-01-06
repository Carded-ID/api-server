import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (plainTextPassword: string) => {
  const encryptedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  return encryptedPassword;
};

export const comparePassword = async (
  plainTextPassword: string,
  encryptedPassword: string
) => {
  const match = await bcrypt.compare(plainTextPassword, encryptedPassword);
  return match;
};
