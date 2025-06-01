import Card from "@/components/Card";
import links from "@/lib/links";
import Link from "next/link";

export default function Home() {
    return (
        <div className="space-y-4">
            <div>
                <h2>All Tools</h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}>
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
