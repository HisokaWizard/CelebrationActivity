import { NeuralNetworkDataDto } from '../../../dtos/NeuralNetworkData.dto.js';
import { neuralNetworkSchema } from '../../../models/NeuralNetworkData.js';

export class NeuroNetworkService {
  async addToKnowledgeBase(data: NeuralNetworkDataDto) {
    try {
      const { value, name } = data;
      const item = await neuralNetworkSchema.findOne({ name });
      if (!item) {
        const newData: Array<Array<number>> = [];
        newData.push(value);
        const result = await neuralNetworkSchema.create({ data: newData, name });
        if (result.errors) {
          throw new Error('addToKnowledgeBase DB: NeuroNetworkService create error: ' + result.errors.message);
        }
      }
      if (item?.data && item.data.length > 0) {
        item.data.push(value);
        await item.save();
      }
    } catch (error) {
      throw new Error('DB: NeuroNetworkService find by name error: ' + error);
    }
  }

  async getAllKnowledge() {
    try {
      const result = await neuralNetworkSchema.find();
      if (!result) {
        return [];
      }
      return result;
    } catch (error) {
      throw new Error('getAllKnowledge DB: NeuroNetworkService find error: ' + error);
    }
  }
}

export const neuroNetworkService = new NeuroNetworkService();
