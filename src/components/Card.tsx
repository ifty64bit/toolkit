import { Badge } from "@/components/ui/badge";

type Props = {
    title: string;
    description: string;
    tag: string;
    icon: React.ReactNode;
};
function Card({ title, description, tag, icon }: Props) {
    return (
        <div className="w-full min-h-36 h-full bg-white border rounded-xl flex gap-7 p-6 hover:shadow-md hover:bg-background/5 transition-shadow duration-200 ease-in-out">
            <div className="w-8 text-3xl">{icon}</div>
            <div className="space-y-2">
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
                <Badge variant={"outline"}>{tag}</Badge>
            </div>
        </div>
    );
}

export default Card;
