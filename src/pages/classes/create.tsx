import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack, useList } from '@refinedev/core'
import React from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "@refinedev/react-hook-form";
import { classSchema } from '@/lib/schema'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import UploadWidget from '@/components/upload-widget'
import { Subject, User, Department } from '@/types'

  

const Create = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(classSchema),
        refineCoreProps: {
            resource: "classes",
            action: "create",
        },
        defaultValues: {
            status: "active",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
    } = form;

    const onSubmit = async (values: z.infer<typeof classSchema>) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating class:", error);
        }
    };

    const {query: departmentsQuery} = useList<Department>({
        resource: "departments",
        pagination: {
            pageSize: 100,
        }
    });

    const {query: subjectsQuery} = useList<Subject>({
        resource: "subjects",
        pagination: {
            pageSize: 100,
        }
    });

    const {query: teachersQuery} = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "teacher"
            }
        ],
        
        pagination: {
            pageSize: 100,
        }
    });

    const departments = departmentsQuery?.data?.data || [];
    const departmentsLoading = departmentsQuery.isLoading;
    const allSubjects = subjectsQuery?.data?.data || [];
    const subjectsLoading = subjectsQuery.isLoading;
    const allTeachers = teachersQuery?.data?.data || [];
    const teachersLoading = teachersQuery.isLoading;

    const selectedDepartmentId = form.watch('departmentId');

    // Filter subjects by selected department
    const filteredSubjects = selectedDepartmentId
        ? allSubjects.filter(subject => subject.departmentId === selectedDepartmentId)
        : [];

    // Filter teachers by selected department
    const filteredTeachers = selectedDepartmentId
        ? allTeachers.filter(teacher => 
            teacher.departments?.some(dept => dept.id === selectedDepartmentId)
          )
        : [];

    const bannerPublicId = form.watch('bannerCldPubId');
    const setBannerImage = (file: any, field: any) => {
        if(file) {
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }else{
            field.onChange('');
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
    }

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>
            <div className="intro-row">
                <p>Provide the required information below to add a class.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
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
                                    name= 'bannerUrl'
                                    render = {({field}) =>(
                                        <FormItem>
                                            <FormLabel>Banner Image <span className="text-orange-600">*</span></FormLabel>
                                            <FormControl>
                                                <UploadWidget 
                                                    value = {field.value ? {url: field.value, publicId: bannerPublicId ?? ''}: null}
                                                    onChange = {(file: any) => setBannerImage(file,field)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className="text-destructive text-sm">
                                                {errors.bannerCldPubId.message?.toString()}
                                                </p>
                                            )}
                                        </FormItem>
                                    ) }
                                />

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Class Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    placeholder="Introduction to Biology - Section A"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Department <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(Number(value))
                                                }
                                                value={field.value?.toString()}
                                                disabled={departmentsLoading}
                                            >
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.id.toString()}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="subjectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Subject <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(Number(value))
                                                    }
                                                    value={field.value?.toString()}
                                                    disabled={subjectsLoading || !selectedDepartmentId}
                                                >
                                                    <FormControl className='border-2 border-primary rounded-md p-2'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={selectedDepartmentId ? "Select a subject" : "Select a department first"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {filteredSubjects.map((subject) => (
                                                            <SelectItem
                                                                key={subject.id}
                                                                value={subject.id.toString()}
                                                            >
                                                                {subject.name} ({subject.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="teacherId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Teacher <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={teachersLoading || !selectedDepartmentId}
                                                >
                                                    <FormControl className='border-2 border-primary rounded-md p-2'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={selectedDepartmentId ? "Select a teacher" : "Select a department first"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {filteredTeachers.map((teacher) => (
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
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capacity</FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        type="number"
                                                        placeholder="30"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Number(value) : undefined);
                                                        }}
                                                        value={(field.value as number | undefined) ?? ""}
                                                        name={field.name}
                                                        ref={field.ref}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Status <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl className='border-2 border-primary rounded-md p-2'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                            <FormLabel>Description</FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Textarea
                                                    placeholder="Brief description about the class"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>Creating Class...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Create Class"
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

export default Create;
