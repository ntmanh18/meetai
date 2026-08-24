import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/meetings/params";
import MeetingListHeader from "@/modules/meetings/ui/components/meeting-list-header";
import MeetingsView, { MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    searchParam : Promise<SearchParams>
}
const Page =async ({searchParam}:Props) => {
    const param = await loadSearchParams(searchParam)
        const session = await auth.api.getSession({
            headers: await headers(),
          });
          if(!session) {
            redirect("/sign-in");
          }
    const queryClient= getQueryClient();
    void  await queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({...param})
    )
    return ( 
        <>
        <MeetingListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError/>}>
                <MeetingsView />
                </ErrorBoundary>
            </Suspense> 
        </HydrationBoundary>
        </>
     );
}
 
export default Page;