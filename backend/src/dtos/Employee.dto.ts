export type SexType = 'male' | 'female';

export interface EmployeeDto {
  id: string;
  email: string;
  isActivated: boolean;
  name: string;
  sex: SexType;
  age: number;
  avatar: string;
  roomList: Array<unknown>;
}
