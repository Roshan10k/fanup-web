"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/app/lib/action/admin/user-action";
import { z } from "zod";

const editUserSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional().or(z.literal('')),
    photo: z.any().optional(),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
    user: any;
    userId: string;
}

export default function EditUserForm({ user, userId }: EditUserFormProps) {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditUserData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: EditUserData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            if (data.fullName) formData.append('fullName', data.fullName);
            if (data.email) formData.append('email', data.email);
            if (data.password) formData.append('password', data.password);
            if (data.photo) formData.append('photo', data.photo);

            const result = await handleUpdateUser(userId, formData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success('User updated successfully!');
            router.push(`/admin/users/${userId}`);
            router.refresh();
        } catch (error) {
            toast.error('Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Preview */}
            {imagePreview ? (
                <div className="flex justify-center">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center text-3xl font-bold">
                        {user.fullName?.charAt(0) || 'U'}
                    </div>
                </div>
            )}

            {/* Photo Input */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Profile Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm"
                />
            </div>

            {/* Full Name */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                    {...register("fullName")}
                    className="w-full px-3 py-2 border rounded-md"
                />
                {errors.fullName && (
                    <p className="text-xs text-red-600">{errors.fullName.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border rounded-md"
                />
                {errors.email && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    New Password (leave blank to keep current)
                </label>
                <input
                    type="password"
                    {...register("password")}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="••••••"
                />
                {errors.password && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-md bg-foreground text-background font-semibold disabled:opacity-50"
                >
                    {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-2 rounded-md border font-semibold"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}