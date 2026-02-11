import { BACKEND_BASE_URL } from "@/constants";
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { get } from "http";
import { map } from "zod";

if(!BACKEND_BASE_URL) {
  throw new Error('BACKEND_BASE_URL is not set');
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed';
  try {
    const payload = (await response.json()) as { message?: string };
    if ( payload?.message) {
      message = payload.message;
    }
  } catch (error) {
    // Ignore JSON parsing errors
  }
  return{
    message,
    statusCode: response.status,
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => {
      if (resource === 'teachers') return 'users';
      return resource;
    },
    buildQueryParams: async ({ filters, resource, pagination }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const params: Record<string, string|number> = {page, limit: pageSize};

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';

        const value = String(filter.value);

        if(resource === 'subjects') {
          if(field === 'department') {
            params.department = value;
          }
          if(field === 'name' || field === 'code') {
            params.search = value;
          }
        }

        if(resource === 'classes') {
          if(field === 'name') params.search = value;
          if(field === 'subject') params.subject = value;
          if(field === 'teacher') params.teacher = value;
          if(field === 'department') params.department = value;
        }

        if(resource === 'users' || resource === 'teachers' || resource === 'students') {
          if(field === 'role') {
            params.role = value;
          }
          if(field === 'name') {
            params.search = value;
          }
          if(field === 'department') {
            params.department = value;
          }
          if(field === 'gender') {
            params.gender = value;
          }
        }

      })

      return params;
    },

    mapResponse: async (response) => {
      if(!response.ok) {
        throw await buildHttpError(response);
      }
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      if(!response.ok) {
        throw await buildHttpError(response);
      }
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => {
      if (resource === 'teachers') return 'users';
      if (resource === 'students') return 'students';
      return resource;
    },
    buildBodyParams: async({ variables, resource }) => {
      // Map bannerUrl to image for teachers/users resource
      if ((resource === 'users' || resource === 'teachers') && 'bannerUrl' in variables) {
        const { bannerUrl, bannerCldPubId, address, age, gender, joiningDate, allocatedClasses, allocatedDepartments, ...rest } = variables;
        return {
          ...rest,
          image: bannerUrl,
          imageCldPubId: bannerCldPubId,
          // address, age, gender, joiningDate, allocatedClasses, allocatedDepartments would need separate endpoints/tables
        };
      }
      return variables;
    },
    mapResponse: async (response) => {
      if(!response.ok) {
        throw await buildHttpError(response);
      }
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => {
      const endpoint = resource === 'teachers' ? 'users' : resource;
      return `${endpoint}/${id}`;
    },
    mapResponse: async (response) => {
      if(!response.ok) {
        throw await buildHttpError(response);
      }
      const json: GetOneResponse = await response.json();
      return json.data ?? [];
    },
  }
}

const {dataProvider} = createDataProvider(BACKEND_BASE_URL, options);

export {dataProvider};