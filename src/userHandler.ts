import { User, AddUserReturn } from '../types';

const users: User[] = [];

export const addUser = (id: string, name: string ): AddUserReturn => {
  const trimmedName = name.trim();

  const userExists = users.find((user) => user.name.toLowerCase() === trimmedName.toLowerCase());
  if(userExists) {
    return { error: 'Username already in use'};
  }

  const user: User = { id, name: trimmedName };

  users.push(user);

  return { user };
};

export const removeUser = ( id: string ): User | void => {
  const indexOfUser: number = users.findIndex((user) => user.id === id);

  if ( indexOfUser !== -1) {
    return users.splice(indexOfUser, 1)[0];
  }
};

export const getUser = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};


