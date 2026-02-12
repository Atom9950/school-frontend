import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack, useList, useGo, useShow } from '@refinedev/core'
import { useParams } from 'react-router'
import React, { useEffect } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "@refinedev/react-hook-form";
import { teacherSchema } from '@/lib/schema'
import * as z from 'zod'

// Allow optional images in edit mode
const teacherSchemaEdit = teacherSchema.extend({
    bannerUrl: z.string().optional(),
    bannerCldPubId: z.string().optional(),
});
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
import { Department } from '@/types'

const Create = () => {
    const back = useBack();
    const go = useGo();
    const { id } = useParams();
    const isEditMode = !!id;

    const { query: teacherQuery } = useShow({
        resource: "teachers",
        id: id!,
        queryOptions: {
            enabled: isEditMode,
        },
    });

    const form = useForm({
        resolver: zodResolver(isEditMode ? teacherSchemaEdit : teacherSchema),
        refineCoreProps: {
            resource: "teachers",
            action: isEditMode ? "edit" : "create",
            id: isEditMode ? id : undefined,
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
            phoneNumber: "",
            allocatedDepartments: [],
        },
    });

    useEffect(() => {
        if (isEditMode && teacherQuery.data?.data) {
            const teacher = teacherQuery.data.data;
            
            // Format date to YYYY-MM-DD for input type="date"
            let formattedDate = "";
            if (teacher.joiningDate) {
                const date = new Date(teacher.joiningDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
                console.log("Setting joining date to:", formattedDate);
            }
            
            // Use setValue for each field to properly update the form
            form.setValue("name", teacher.name || "");
            form.setValue("email", teacher.email || "");
            form.setValue("address", teacher.address || "");
            form.setValue("age", teacher.age || undefined);
            form.setValue("gender", teacher.gender || undefined);
            form.setValue("joiningDate", formattedDate, { shouldValidate: true, shouldDirty: true });
            form.setValue("bannerUrl", teacher.image || "");
            form.setValue("bio", teacher.bio || "");
            form.setValue("phoneNumber", teacher.phoneNumber || "");
            // Store department names for display in form
            form.setValue("allocatedDepartments", teacher.departments?.map((d: any) => d.name) || []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, teacherQuery.data?.data]);

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
    } = form;

    const onSubmit = async (values: z.infer<typeof teacherSchema> | z.infer<typeof teacherSchemaEdit>) => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000';
            const method = isEditMode ? "PUT" : "POST";
            const endpoint = isEditMode ? `${apiUrl}users/${id}` : `${apiUrl}users`;
            
            // Ensure joining date is in correct format
            let formattedJoiningDate = values.joiningDate;
            if (typeof formattedJoiningDate === 'string' && formattedJoiningDate.includes('T')) {
                formattedJoiningDate = formattedJoiningDate.split('T')[0];
            }
            
            const payload = {
                name: values.name,
                email: values.email,
                address: values.address,
                age: values.age,
                gender: values.gender,
                joiningDate: formattedJoiningDate,
                bannerUrl: values.bannerUrl,
                bannerCldPubId: values.bannerCldPubId,
                bio: values.bio,
                phoneNumber: values.phoneNumber,
                allocatedDepartments: values.allocatedDepartments || [],
                role: "teacher"
            };
            
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} teacher: ${responseData.message || response.statusText}`);
            }

            go({ to: { resource: "teachers", action: "list" } });
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} teacher:`, error);
            alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const {query: departmentsQuery} = useList<Department>({
        resource: "departments",
        pagination: {
            pageSize: 100,
        }
    });

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

            <h1 className="page-title">{isEditMode ? 'Edit Teacher' : 'Create a Teacher'}</h1>
            <div className="intro-row">
                <p>{isEditMode ? 'Update the teacher information below.' : 'Provide the required information below to add a teacher.'}</p>
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
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Mobile Number <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    placeholder="+1 (555) 123-4567"
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
                                                    value={typeof field.value === 'string' && field.value.includes('T') 
                                                        ? field.value.split('T')[0]
                                                        : field.value || ""
                                                    }
                                                    onChange={(e) => field.onChange(e.target.value)}
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

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>{isEditMode ? 'Updating Teacher...' : 'Creating Teacher...'}</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        isEditMode ? "Update Teacher" : "Create Teacher"
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
