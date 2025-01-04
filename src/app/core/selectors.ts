import { User } from './interfaces/user.interface'

const getUsersList = (state: { users: Array<User> }) => state.users;

export { getUsersList };