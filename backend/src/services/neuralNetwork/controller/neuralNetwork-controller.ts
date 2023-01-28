import { NextFunction, Request, Response } from 'express';
import { NeuralNetworkDataDto } from '../../../dtos/NeuralNetworkData.dto.js';
import { neuroNetworkService } from '../services/neuralNetwork-service.js';

export class NeuralNetworkController {
  async addToKnowledgeBase(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, value } = req.body;
      await neuroNetworkService.addToKnowledgeBase({ name, value });
      return res.status(200);
    } catch (error) {
      next(error);
    }
  }

  async getAllKnowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await neuroNetworkService.getAllKnowledge();
      const normalazeResult = result
        .map<NeuralNetworkDataDto>((it) => ({
          name: it.name ?? '',
          value: it.data,
        }))
        .filter((it) => !it.name);
      return res.json(normalazeResult);
    } catch (error) {
      next(error);
    }
  }
}

export const neuralNetworkController = new NeuralNetworkController();
