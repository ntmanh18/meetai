import { db } from "@/db";
import { agents, meeting } from "@/db/schema";
import {createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {z} from "zod"
import { eq,getTableColumns, sql, and, ilike, desc, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schema";
import { MeetingStatus } from "../type";


export const meetingsRouter = createTRPCRouter({
    getMany: protectedProcedure
    .input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Proccessing,
            MeetingStatus.Cancelled
        ]).nullish()
    }))
    .query(async ({ ctx, input }) => {
        console.log(input)
        const { page, pageSize, search, status, agentId }=input;
        const data = await db.select({
            ...getTableColumns(meeting),
            agent: agents,
            duration: sql<number>`extract(epoch from(ended_at - started_at))`.as("duration"),
        })
        .from(meeting)
        .innerJoin(agents, eq(meeting.agentId, agents.id))
        .where(
            and(
                eq(meeting.userId, ctx.auth.user.id),
                search ? ilike(meeting.name,`%${search}%`) : undefined,
                status ? eq(meeting.status,status) : undefined,
                agentId ? eq(meeting.agentId,agentId) : undefined
            )
        )
        .orderBy(desc(meeting.createdAt), desc(meeting.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
        const total = await db.select({count: count()})
        .from(meeting)
        .where(
            and(
                eq(meeting.userId, ctx.auth.user.id),
                search ? ilike(meeting.name,`%${search}%`) : undefined,
                status ? eq(meeting.status,status) : undefined,
                agentId ? eq(meeting.agentId,agentId) : undefined
            )
        )

        const totalPages = Math.ceil(total[0].count / pageSize);
        return {
            items: data,
            total: total[0].count,
            totalPages,
        };

    }),

    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({input,ctx}) => {
        const [data] = await db
        .select({
            ...getTableColumns(meeting),
            agent: agents,
            duration: sql<number>`extract(epoch from(ended_at - started_at))`.as("duration"),
        })
        .from(meeting)
        .innerJoin(agents,eq(meeting.agentId,agents.id))
        .where(
            and(
                eq(meeting.id,input.id),
                eq(meeting.userId, ctx.auth.user.id)
            )
        );
        if(!data){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not found"
            });
        }
        return data;

    }),

    create: protectedProcedure
       .input(meetingsInsertSchema)
       .mutation(async({input,ctx}) => {
           const [createdMeeting] = await db
                                       .insert(meeting)
                                       .values({
                                           ...input,
                                          userId: ctx.auth.user.id 
                                       })
                                       .returning();
           return createdMeeting;
       }),

    update: protectedProcedure
       .input(meetingsUpdateSchema)
       .mutation(async({ctx,input}) => {
           const [updateMeeting] = await db
           .update(meeting)
           .set(input)
           .where(
                   and(
                       eq(meeting.id, input.id),
                       eq(meeting.userId, ctx.auth.user.id)
                   )
               )
           .returning();
           if (!updateMeeting){
               throw new TRPCError(
                   {
                   code: "NOT_FOUND",
                   message: "Meeting not found"
                   }
               )
           }
   
           return updateMeeting;
       }),

       remove: protectedProcedure
       .input(z.object({id:z.string()}))
       .mutation(async({ctx,input}) => {
           const [removeMeeting] = await db
           .delete(meeting)
           .where(
                   and(
                       eq(meeting.id, input.id),
                       eq(meeting.userId, ctx.auth.user.id)
                   )
               )
           .returning();
           if (!removeMeeting){
               throw new TRPCError(
                   {
                   code: "NOT_FOUND",
                   message: "Meeting not found"
                   }
               )
           }
   
           return removeMeeting;
       })

})