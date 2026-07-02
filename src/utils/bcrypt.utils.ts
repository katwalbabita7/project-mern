import bcrypt from "bcryptjs";

// * hash
export const hash = async (password: string) => {
    try{
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
    }catch(error){
        throw error;
    }
};
// * compare
export const compare = async (password: string, hash: string) => {
    try{
  return await bcrypt.compare(password, hash);
    }catch(error){
        throw error;
    }
};