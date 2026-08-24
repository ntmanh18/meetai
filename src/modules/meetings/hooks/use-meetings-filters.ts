import { DEFAULT_PAGE } from "@/constant";
import {parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates} from "nuqs"
import { MeetingStatus } from "../type";
const useMeetingFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault("").withOptions({clearOnDefault:true})
});
}
 
export default useMeetingFilters;