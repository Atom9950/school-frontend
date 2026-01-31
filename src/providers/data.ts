import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { mockSubjects } from "../constants/mock-data";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord> ({resource } : GetListParams): Promise<GetListResponse<TData>> => {
    if(resource !== 'subjects') return { data: [] as TData[], total: 0 };
    
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length,
    }
  },

  getOne: async () => {throw new Error("Method not implemented.")},
  create: async () => {throw new Error("Method not implemented.")},
  update: async () => {throw new Error("Method not implemented.")},
  deleteOne: async () => {throw new Error("Method not implemented.")},

  getApiUrl: () => '',

}