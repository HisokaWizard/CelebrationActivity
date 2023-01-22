import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../../exeptions/api-error.js';
import { employeeService } from '../services/employee-service.js';

const thirtyDaysMillisec = 30 * 24 * 60 * 60 * 1000;
const clientURL = process.env.CLIENT_URL ?? '';

const setRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    maxAge: thirtyDaysMillisec,
    httpOnly: true,
  });
};

export class EmployeeController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Validation error',
            errors.array().map((it) => it.msg),
          ),
        );
      }
      const { email, password } = req.body;
      const employeeResult = await employeeService.registration(email, password);
      if (!employeeResult?.refreshToken) return null;
      setRefreshToken(res, employeeResult?.refreshToken);
      return res.json(employeeResult);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const employeeResult = await employeeService.login(email, password);
      if (!employeeResult?.refreshToken) return null;
      setRefreshToken(res, employeeResult?.refreshToken);
      return res.json(employeeResult);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await employeeService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await employeeService.activate(activationLink);
      res.redirect(clientURL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await employeeService.refresh(refreshToken);
      setRefreshToken(res, refreshToken);
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await employeeService.getAllEmployees();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export const emploeeController = new EmployeeController();
