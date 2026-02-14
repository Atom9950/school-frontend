import { DataProvider } from "@refinedev/core";
import { isGuestMode, MOCK_DATA } from "@/lib/guest-mode";

export function createGuestAwareDataProvider(baseProvider: DataProvider): DataProvider {
  return {
    ...baseProvider,
    
    getList: async (params: any) => {
      if (!isGuestMode()) {
        return baseProvider.getList!(params);
      }

      const { resource } = params;

      // Return mock data based on resource
      switch (resource) {
        case "classes":
          return {
            data: MOCK_DATA.classes as any[],
            total: MOCK_DATA.classes.length,
          };
        case "subjects":
          return {
            data: MOCK_DATA.subjects as any[],
            total: MOCK_DATA.subjects.length,
          };
        case "teachers":
        case "users":
          return {
            data: MOCK_DATA.teachers as any[],
            total: MOCK_DATA.teachers.length,
          };
        case "students":
          return {
            data: MOCK_DATA.students as any[],
            total: MOCK_DATA.students.length,
          };
        case "departments":
          return {
            data: MOCK_DATA.departments as any[],
            total: MOCK_DATA.departments.length,
          };
        default:
          return {
            data: [],
            total: 0,
          };
      }
    },

    getOne: async (params: any) => {
      if (!isGuestMode()) {
        return baseProvider.getOne!(params);
      }

      const { resource, id } = params;

      // Return mock data based on resource
      switch (resource) {
        case "classes":
          return {
            data: (MOCK_DATA.classes.find((c) => c.id === id) || {}) as any,
          };
        case "subjects":
          return {
            data: (MOCK_DATA.subjects.find((s) => s.id === id) || {}) as any,
          };
        case "teachers":
        case "users":
          return {
            data: (MOCK_DATA.teachers.find((t) => t.id === id) || {}) as any,
          };
        case "students":
          return {
            data: (MOCK_DATA.students.find((s) => s.id === id) || {}) as any,
          };
        case "departments":
          return {
            data: (MOCK_DATA.departments.find((d) => d.id === id) || {}) as any,
          };
        default:
          return {
            data: {} as any,
          };
      }
    },

    create: async (params: any) => {
      if (isGuestMode()) {
        throw new Error(
          "Guest users cannot create items. Please sign up to get full access."
        );
      }
      return baseProvider.create!(params);
    },

    update: async (params: any) => {
      if (isGuestMode()) {
        throw new Error(
          "Guest users cannot edit items. Please sign up to get full access."
        );
      }
      return baseProvider.update!(params);
    },
  };
}
