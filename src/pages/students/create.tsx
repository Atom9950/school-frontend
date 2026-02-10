import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack, useList } from '@refinedev/core'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "@refinedev/react-hook-form";
import { studentSchema } from '@/lib/schema'
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
import { Department } from '@/types'

const StudentCreate = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(studentSchema),
        refineCoreProps: {
            resource: "students",
            action: "create",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
    } = form;

    const onSubmit = async (values: z.infer<typeof studentSchema>) => {
        try {
            const payload: any = {
                name: values.name,
                email: values.email,
                age: values.age,
                gender: values.gender,
                address: values.address,
                phoneNumber: values.phoneNumber,
                whatsappNumber: values.bio,
                fathersName: values.fathersName,
                mothersName: values.mothersName,
                rollNumber: values.rollNumber,
                admissionDate: values.joiningDate,
                departmentId: values.department,
                image: values.bannerUrl,
                imageCldPubId: values.bannerCldPubId,
            };
            // Generate default email if not provided
            if (!payload.email) {
                const timestamp = Date.now();
                payload.email = `student_${timestamp}@school.local`;
            }
            await onFinish(payload);
        } catch (error) {
            console.error("Error creating student:", error);
        }
    };

    const { query: departmentsQuery } = useList<Department>({
        resource: "departments",
        pagination: {
            pageSize: 100,
        }
    });

    const departments = departmentsQuery?.data?.data || [];
    const departmentsLoading = departmentsQuery.isLoading;

    const bannerPublicId = form.watch('bannerCldPubId');
    const setBannerImage = (file: any, field: any) => {
        if (file) {
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true,
            })
        } else {
            field.onChange('');
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
    }

    return (
        <CreateView className="student-view">
            <Breadcrumb />

            <h1 className="page-title">Add a Student</h1>
            <div className="intro-row">
                <p>Provide the required information below to add a student.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="student-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Fill out form
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Banner Image */}
                                <FormField
                                    control={control}
                                    name='bannerUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image <span className="text-orange-600">*</span></FormLabel>
                                            <FormControl>
                                                <UploadWidget
                                                    value={field.value ? { url: field.value, publicId: bannerPublicId ?? '' } : null}
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

                                {/* Name */}
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

                                {/* Age and Gender Grid */}
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
                                                        placeholder="16"
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
                                                    value={field.value}
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

                                {/* Father's Name and Mother's Name Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="fathersName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Father's Name</FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        placeholder="Father's full name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="mothersName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mother's Name</FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        placeholder="Mother's full name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Address */}
                                <FormField
                                    control={control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Address <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Textarea
                                                    placeholder="Enter full address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number and WhatsApp Number Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        placeholder="+91 9876543210"
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
                                                    WhatsApp Number <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        placeholder="+91 9876543210"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email */}
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (Optional)</FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    type="email"
                                                    placeholder="student@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Admission Date and Department Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="joiningDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Admission Date <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl className='border-2 border-primary rounded-md p-2'>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="department"
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
                                </div>

                                {/* Roll Number */}
                                <FormField
                                    control={control}
                                    name="rollNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Roll Number</FormLabel>
                                            <FormControl className='border-2 border-primary rounded-md p-2'>
                                                <Input
                                                    placeholder="Enter roll number"
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
                                            <span>Creating Student...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Create Student"
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

export default StudentCreate;
