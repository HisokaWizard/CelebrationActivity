import { Router } from 'express';
import { body } from 'express-validator';
import { neuralNetworkController } from '../controller/neuralNetwork-controller.js';

export const nnRouter = new (Router as any)();
nnRouter.post(
  '/neural-network',
  body('name').isString(),
  body('value').isArray(),
  neuralNetworkController.addToKnowledgeBase,
);
nnRouter.get('/neural-network', neuralNetworkController.getAllKnowledge);
