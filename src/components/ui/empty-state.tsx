
import Image from "next/image";
interface Props {
    titlle: string;
    description: string,
    image? : string
}

const EmptyState = ({titlle, description,image="/empty.svg"}: Props) => {
    return (
     <div className="flex flex-col items-center justify-center">
            <Image src={image} alt="Empty" width={240} height={240} className="flex flex-col items-center justify-center"/>
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
                <h6 className="text-lg font-medium">{titlle}</h6>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
    </div> );
}
 
export default EmptyState;