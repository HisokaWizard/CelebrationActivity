import bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { EmployeeDto } from '../../../dtos/Employee.dto.js';
import { ApiError } from '../../../exeptions/api-error.js';
import { employeeSchema } from '../../../models/Employee.js';
import { mailService } from './mail-service.js';
import { TokenService, tokenService } from './token-service.js';

type EmployeeSchemaType = Document<
  unknown,
  any,
  {
    email: string;
    password: string;
    isActivated: boolean;
    roomList: any[];
    activationLink?: string | undefined;
    name?: string | undefined;
    sex?:
      | {
          prototype?:
            | {
                value?: unknown;
              }
            | undefined;
        }
      | undefined;
    age?: number | undefined;
    avatar?: string | undefined;
  }
> | null;

const updateAndSetToken = async (employee: EmployeeSchemaType, tokenService: TokenService) => {
  if (!employee) return;
  const employeeDto: EmployeeDto = {
    id: employee._id as string,
    email: employee.get('email'),
    isActivated: employee.get('isActivated'),
    name: employee.get('name'),
    sex: employee.get('sex'),
    age: employee.get('age'),
    avatar: employee.get('avatar'),
    roomList: employee.get('roomList'),
  };
  const tokens = tokenService.generateTokens({ ...employeeDto });
  await tokenService.saveToken(employeeDto.id, tokens.refreshToken);
  return { ...tokens, employee: employeeDto };
};

export class EmployeeService {
  async registration(email: string, password: string) {
    const candidate = await employeeSchema.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Employee with email ${email} already exists.`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = uuid();
    const employee = await employeeSchema.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/activate/${activationLink}`);
    return updateAndSetToken(employee, tokenService);
  }

  async login(email: string, password: string) {
    const employee = await employeeSchema.findOne({ email });
    if (!employee) {
      throw ApiError.BadRequest(`Employee with email ${email} doesn't exist.`);
    }
    const isEqualPassword = await bcrypt.compare(password, employee.password);
    if (!isEqualPassword) {
      throw ApiError.BadRequest(`Password incorrect.`);
    }
    return updateAndSetToken(employee, tokenService);
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink: string) {
    const employee = await employeeSchema.findOne({ activationLink });
    if (!employee) {
      throw ApiError.BadRequest(`Activation link is not correct.`);
    }
    employee.isActivated = true;
    await employee.save();
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const validatedToken = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!validatedToken || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const employee = await employeeSchema.findById(tokenFromDb.employeeId);
    return updateAndSetToken(employee, tokenService);
  }

  async getAllEmployees() {
    const allEmployees = await employeeSchema.find();
    return allEmployees;
  }
}

export const employeeService = new EmployeeService();
