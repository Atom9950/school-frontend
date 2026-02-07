import React from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBack, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { subjectSchema } from "@/lib/schema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, BookOpen } from "lucide-react";
import { Department } from "@/types";

const SubjectCreate = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = form;

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: {
      pageSize: 100,
    },
  });

  const departments = departmentsQuery?.data?.data || [];
  const departmentsLoading = departmentsQuery.isLoading;

  return (
    <CreateView className="subject-view">
      <Breadcrumb />

      <h1 className="page-title">Add New Subject</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a new subject.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="subject-form-card">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>
                         Subject Name <span className="text-orange-600">*</span>
                       </FormLabel>
                      <FormControl className="border-2 border-primary rounded-md p-2">
                        <Input
                          placeholder="e.g. Biology, Chemistry, Mathematics"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the subject you want to add.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>
                         Subject Code <span className="text-orange-600">*</span>
                       </FormLabel>
                      <FormControl className="border-2 border-primary rounded-md p-2">
                        <Input
                          placeholder="e.g. BIO101, CHEM202, MATH301"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique code to identify this subject.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>
                           Department <span className="text-orange-600">*</span>
                         </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={departmentsLoading}
                        >
                          <FormControl className="border-2 border-primary rounded-md p-2">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Which department does this subject belong to?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          placeholder="Provide a brief description about this subject, what it covers, and its importance."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give a detailed description of the subject content and
                        objectives.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-2 items-center">
                      <span>Creating Subject...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    "Create Subject"
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

export default SubjectCreate;
