export interface User {
  name: string;
  sex: 'male' | 'female';
  age: number;
}

export const createUser = (user: User) => {
  console.log(user);
};
