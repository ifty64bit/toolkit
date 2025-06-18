import Card from "@/components/Card";
import links from "@/lib/links";
import Link from "next/link";

export default function Home() {
    return (
        <div className="space-y-4">
            <div>
                <h2>All Tools</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className="block">
                        <Card
                            title={link.title}
                            description={link.description}
                            tag={link.tag}
                            icon={link.icon}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
