import BaseService from "../BaseService/Base.service.ts";

export interface UserCreation {
  email: string;
  password: string;
  passwordConfirmation: string;
  loginAfterCreate?: boolean;
}

const UserService = () => {
  const Service = BaseService()
  const getUsers = () => {
    return Service.get("/user")
  }

  const createUser = (data: UserCreation) => Service.post("/user/create", data);

  return {
    getUsers,
    createUser
  }
}

export default UserService;
