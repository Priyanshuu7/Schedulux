"use server";

import prisma from "./lib/db";
import requireUser from "./lib/hooks";
import { parseWithZod} from "@conform-to/zod"
import { onboardingSchema, onboardingSchemaValidation, SettingSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";


export async function onBoardingAction( prevState:any, formdata:FormData) {
    const session = await requireUser()

    const submission = await parseWithZod(formdata,{
        schema:onboardingSchemaValidation({
            async  isUsernameUnique() {
                const existingUsername = await prisma.user.findUnique({
                    where:{
                        userName : formdata.get('userName') as string
                     },
                });

                return !existingUsername;
            },
        }),
        async: true,
    });

   if (submission.status !== "success"){
     return submission.reply()

   }
    const data = await prisma.user.update({
        where :{
            id : session.user?.id,
        },
        data:{
            userName :submission.value.userName,
            name : submission.value.fullName
        }
    }) 
    
    return redirect("/onboarding/grant-id")
}


export async function SettingAction( prevState:any, formdata:FormData) {
    const session = await requireUser( )

    const submission = parseWithZod(formdata,{
        schema: SettingSchema,
    });
    if(submission.status  !== "success"){
        return submission.reply()
    }
    const user = await prisma.user.update({
        where:{
            id : session.user?.id
        },
        data:{
            name: submission.value.fullName,
            image: submission.value.porfileImage 
        }
    })

    return redirect("/dashboard")
}