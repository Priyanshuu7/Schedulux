"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useState } from "react";
import { SettingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SettingSchema } from "../lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";


interface SettingFormProps {
  fullName: string;
  email: string;
  profileImage: string;
}

export function SettingForm({
  email,
  fullName,
  profileImage,
}: SettingFormProps) {
  const [lastResult, action] = useActionState(SettingAction, undefined);
  const [currentImage, setCurrentImage] = useState(profileImage);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: SettingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteUserImage = () => setCurrentImage("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <form
        noValidate
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
      >
        <CardContent className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              defaultValue={fullName}
              placeholder="@abcxyz"
            />
            {fields.fullName.errors && (
              <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              disabled
              defaultValue={email}
              placeholder="test@text.com"
            />
          </div>
          <div className="grid grid-y-5">
            <Label>Profile Image</Label>

            <input type="hidden" name={fields.porfileImage.name } key={fields.porfileImage.key}  value={currentImage}/>
            <br />
            {currentImage ? (
              <div className="relative size-16">
                <img
                  src={currentImage}
                  alt="Profile"
                  className="size-16 rounded-lg"
                />
                <Button
                  type="button"
                  onClick={handleDeleteUserImage}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
                <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  container: "border-muted",
                }}
                onClientUploadComplete={(res) => {
                    setCurrentImage(res[0].ufsUrl);
                  toast.success("Profile image uploaded");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
              />
            )}
            <p className="text-red-600 text-sm">
                {fields.porfileImage.errors}
            </p>
          </div>
        </CardContent>
        <CardFooter className="py-4">
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}