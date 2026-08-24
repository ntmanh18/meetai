"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react"
import { DashboardCommand } from "./Dashboard-command"
import { useState } from "react"

export const DashboardNavbar = () => {
    const {state, toggleSidebar, isMobile } = useSidebar()
    const [commandOpen, setCommandOpen] = useState(false)
    return (
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
            <Button onClick={toggleSidebar} className="size-9" variant="outline">
                {(state == "collapsed" || isMobile) 
                    ? <PanelLeftIcon className="size-4"/>
                    : <PanelLeftCloseIcon className="size-4" />
                }
            </Button>
            <Button variant="outline" className="h-9 w-60 justify-start font-normal text-muted-foreground\
            hover:text-muted-foreground"
            size="sm"
            onClick={()=>{
                setCommandOpen((open) => !open)
            }}>
                <SearchIcon />
                Search
            </Button>
        </nav>
        </>
    )
}