import { Style, Avatar as DicebearAvatar } from '@dicebear/core';
import dylan from '@dicebear/styles/dylan.json' with { type: 'json' };
import initials from '@dicebear/styles/initials.json' with { type: 'json' };
import {
  Avatar as UiAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
interface GeneratedAvatarProps {
    seed : string;
    className? : string;
    variant: "dylan" | "initials"
}

export const GeneratedAvatar = ({
    seed,
    className,
    variant
} :  GeneratedAvatarProps) => {
    let avatar;

    if(variant == 'dylan'){
        const style = new Style(dylan);

        avatar = new DicebearAvatar(style, { seed: seed });
    }else {
         const style = new Style(initials);

        avatar = new DicebearAvatar(style, { 
            seed,
            fontWeight:500,
         });
    }
    return(
        <UiAvatar className={cn(className)}>
            <AvatarImage src={avatar.toDataUri()} alt='Avatar' />
            <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </UiAvatar>
    )
}