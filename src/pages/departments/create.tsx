import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBack, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { departmentSchema } from "@/lib/schema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import UploadWidget from "@/components/upload-widget";
import { User } from "@/types";
import { useState, useMemo } from "react";

const VALID_DEPARTMENTS = {
  "Lower Nursery": 0,
  "Upper Nursery": 1,
  "KG-1": 2,
  "KG-2": 3,
  "Class 1": 4,
  "Class I": 4,
  "Class 2": 5,
  "Class II": 5,
  "Class 3": 6,
  "Class III": 6,
  "Class 4": 7,
  "Class IV": 7,
  "Class 5": 8,
  "Class V": 8,
  "Class 6": 9,
  "Class VI": 9,
  "Class 7": 10,
  "Class VII": 10,
  "Class 8": 11,
  "Class VIII": 11,
  "Class 9": 12,
  "Class IX": 12,
  "Class 10": 13,
  "Class X": 13,
  "Class 11": 14,
  "Class XI": 14,
  "Class 12": 15,
  "Class XII": 15,
};

const DepartmentCreate = () => {
  const back = useBack();
  const [departmentNameError, setDepartmentNameError] = useState<string | null>(
    null,
  );
  const [isValidDepartment, setIsValidDepartment] = useState(false);

  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: {
      resource: "departments",
      action: "create",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    watch,
  } = form;

  const departmentName = watch("name");

  // Validate department name in real-time
  useMemo(() => {
    if (!departmentName) {
      setDepartmentNameError(null);
      setIsValidDepartment(false);
      return;
    }

    const isValid = Object.keys(VALID_DEPARTMENTS).some(
      (validName) => validName.toLowerCase() === departmentName.toLowerCase(),
    );

    if (isValid) {
      setDepartmentNameError(null);
      setIsValidDepartment(true);
    } else {
      setDepartmentNameError("Invalid department name. See suggestions below.");
      setIsValidDepartment(false);
    }
  }, [departmentName]);

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const teachers = teachersQuery?.data?.data || [];
  const teachersLoading = teachersQuery.isLoading;

  const bannerPublicId = form.watch("bannerCldPubId");
  const setBannerImage = (file: any, field: any) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <CreateView className="department-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Department</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a department.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="department-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file: any) => setBannerImage(file, field)}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department Name{" "}
                        <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl
                        className={`border-2 rounded-md p-2 ${
                          isValidDepartment
                            ? "border-green-500"
                            : departmentNameError
                            ? "border-red-500"
                            : "border-primary"
                        }`}
                      >
                        <Input
                          placeholder="e.g., Class 5 or Class V"
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-2 flex items-center gap-2">
                        {isValidDepartment && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Valid department name
                          </div>
                        )}
                        {departmentNameError && (
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {departmentNameError}
                          </div>
                        )}
                      </div>
                      <FormMessage />

                      {/* Suggestions */}
                      {departmentName && !isValidDepartment && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            Valid Department Names:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(VALID_DEPARTMENTS).map((name) => (
                              <div
                                key={name}
                                className="text-sm text-blue-700 cursor-pointer hover:bg-blue-100 p-1 rounded"
                                onClick={() => field.onChange(name)}
                              >
                                {name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl className="border-2 border-primary rounded-md p-2">
                        <Textarea
                          placeholder="Brief description about the department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="headTeacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department Head{" "}
                        <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={teachersLoading}
                      >
                        <FormControl className="border-2 border-primary rounded-md p-2">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem
                              key={teacher.id}
                              value={teacher.id.toString()}
                            >
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !isValidDepartment}
                >
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Creating Department...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : !isValidDepartment ? (
                    "Enter Valid Department Name"
                  ) : (
                    "Create Department"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default DepartmentCreate;
