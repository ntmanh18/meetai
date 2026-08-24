"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../type"
import { GeneratedAvatar } from "@/components/ui/generated-avatar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({row}) => (
        <div className="flex-1  gap-y-1 p-1.5">
            <div className= "flex items-center gap-x-2">
                <GeneratedAvatar 
                variant="dylan"
                seed={row.original.name}
                className="size-7"/>
                <span className="font-semibold capitalize">{row.original.name}</span>
            </div>
            <div className="flex items-center gap-x-1">
                <CornerDownRightIcon className="size-3 text-muted-foreground"/>
                <span className="text-sm text-muted-foreground max-w-50 truncate capitalize">{row.original.instructions}</span>
            </div>
        </div>
    )
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({row}) => (
        <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4" >
            <VideoIcon className="text-blue-700" />
            {row.original.meetingCount} {row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
        </Badge>
    )
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]