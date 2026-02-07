import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack, useList, useGo } from '@refinedev/core'
import React from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "@refinedev/react-hook-form";
import { teacherSchema } from '@/lib/schema'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import UploadWidget from '@/components/upload-widget'
import { ClassDetails, Department } from '@/types'

const Create = () => {
    const back = useBack();
    const go = useGo();

    const form = useForm({
        resolver: zodResolver(teacherSchema),
        refineCoreProps: {
            resource: "teachers",
            action: "create",
            redirect: false,
        },
        defaultValues: {
            name: "",
            email: "",
            address: "",
            age: undefined,
            gender: undefined,
            joiningDate: "",
            bannerUrl: "",
            bannerCldPubId: "",
            bio: "",
            allocatedClasses: [],
            allocatedDepartments: [],
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
    } = form;

    const onSubmit = async (values: z.infer<typeof teacherSchema>) => {
        try {
            console.log("Form submission values:", values);
            const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    address: values.address,
                    age: values.age,
                    gender: values.gender,
                    joiningDate: values.joiningDate,
                    bannerUrl: values.bannerUrl,
                    bannerCldPubId: values.bannerCldPubId,
                    bio: values.bio,
                    allocatedDepartments: values.allocatedDepartments,
                    allocatedClasses: values.allocatedClasses,
                    role: "teacher"
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create teacher");
            }

            const data = await response.json();
            console.log("Teacher created:", data);
            go({ to: { resource: "teachers", action: "list" } });
        } catch (error) {
            console.error("Error creating teacher:", error);
        }
    };

    const {query: classesQuery} = useList<ClassDetails>({
        resource: "classes",
        pagination: {
            pageSize: 100,
        }
    });

    const {query: departmentsQuery} = useList<Department>({
        resource: "departments",
        pagination: {
            pageSize: 100,
        }
    });

    const classes = classesQuery?.data?.data || [];
    const classesLoading = classesQuery.isLoading;
    const departments = departmentsQuery?.data?.data || [];
    const departmentsLoading = departmentsQuery.isLoading;

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
        <CreateView className="teacher-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Teacher</h1>
            <div className="intro-row">
                <p>Provide the required information below to add a teacher.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="teacher-form-card">
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
                                            <FormLabel>Profile Image <span className="text-orange-600">*</span></FormLabel>
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
                                                Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Address <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    placeholder="123 Main Street"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Bio <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <textarea
                                                    placeholder="Write the educational background, qualifications, and experience of the teacher."
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    rows={4}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Age <span className="text-orange-600">*</span>
                                                </FormLabel>
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
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Gender <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value || ""}
                                                >
                                                    <FormControl className='border-2 border-primary rounded-md p-2'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="joiningDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Joining Date <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    type="date"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="allocatedDepartments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allocated Departments</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    const currentValue = field.value || [];
                                                    if (currentValue.includes(value)) {
                                                        field.onChange(currentValue.filter((item: string) => item !== value));
                                                    } else {
                                                        field.onChange([...currentValue, value]);
                                                    }
                                                }}
                                                disabled={departmentsLoading}
                                            >
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select departments" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.name}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {(field.value || []).map((dept: string) => (
                                                    <div key={dept} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                        {dept}
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange((field.value || []).filter((item: string) => item !== dept))}
                                                            className="hover:opacity-70"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="allocatedClasses"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allocated Classes</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    const numValue = Number(value);
                                                    const currentValue = field.value || [];
                                                    if (currentValue.includes(numValue)) {
                                                        field.onChange(currentValue.filter((item: number) => item !== numValue));
                                                    } else {
                                                        field.onChange([...currentValue, numValue]);
                                                    }
                                                }}
                                                disabled={classesLoading}
                                            >
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select classes" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((cls) => (
                                                        <SelectItem
                                                            key={cls.id}
                                                            value={cls.id.toString()}
                                                        >
                                                            {cls.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {(field.value || []).map((classId: number) => {
                                                    const cls = classes.find(c => c.id === classId);
                                                    return (
                                                        <div key={classId} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                            {cls?.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => field.onChange((field.value || []).filter((item: number) => item !== classId))}
                                                                className="hover:opacity-70"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>Creating Teacher...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Create Teacher"
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
