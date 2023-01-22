import jwt, { Secret } from 'jsonwebtoken';
import { EmployeeDto } from '../../../dtos/Employee.dto.js';
import { tokenSchema } from '../../../models/Token.js';

const secretAccess: Secret = process.env.JWT_ACCESS_SECRET ?? '';
const secretRefresh: Secret = process.env.JWT_REFRESH_SECRET ?? '';

export class TokenService {
  generateTokens(payload: EmployeeDto) {
    const accessToken = jwt.sign(payload, secretAccess, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, secretRefresh, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const tokenData = jwt.verify(token, secretAccess);
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const tokenData = jwt.verify(token, secretRefresh);
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(employeeId: string, refreshToken: string) {
    const tokenData = await tokenSchema.findOne({ employeeId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = tokenSchema.create({ employeeId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const token = await tokenSchema.deleteOne({ refreshToken });
    return token;
  }

  async findToken(token: string) {
    const tokenData = await tokenSchema.findOne({ token });
    return tokenData;
  }
}

export const tokenService = new TokenService();
