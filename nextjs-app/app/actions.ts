"use server";

import prisma from "./lib/db";
import requireUser from "./lib/hooks";
import { parseWithZod} from "@conform-to/zod"
import { onboardingSchema, onboardingSchemaValidation, SettingSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";



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
            name : submission.value.fullName,
            availability:{
                createMany:{
                    data:[
                        {
                            day :  "Monday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Tuesday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Wednesday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Thursday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Friday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Saturday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },
                        {
                            day :  "Sunday",
                            fromTime:"08:00",
                            tillTime:"18:00"
                        },

                    ]

                }
            }
        }
    }) 
    return redirect("/onboarding/grant-id")
}


export async function SettingAction( prevState:any, formdata:FormData) {
    const session = await requireUser()

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

export async function UpdateAvailabilityActions(  formdata:FormData) {
    const session = await requireUser( )
    const rawData = Object.fromEntries(formdata.entries( ))

    const availabilityData = Object.keys(rawData).filter((key)=> key.startsWith("id-")).map((key)=>{
         const id = key.replace("id-","")
         return {
            id,
            isActive:rawData[`isActive-${id}`] === "on",
            fromTime :rawData[ `fromTime-${id}`] as string,
            tillTime :rawData[ `till Time-${id}`] as string,
         }
    });

      try {
        await prisma.$transaction(
            availabilityData.map((item) => prisma.availability.update({
                where:{
                    id : item.id
                },

                data:{
                    isActive :item.isActive, 
                    fromTime : item.fromTime as string,
                    tillTime : item.tillTime as string,
                    

                }

            }))
        )
        revalidatePath("/dashboard/availability")
      }


      catch ( error){
        console.log(error)
      }

}