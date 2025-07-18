import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toolCategories } from "@/lib/routes";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Turinhub Atomix</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          常用网页模组网站，仅供内部开发使用。
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toolCategories.map(category => (
          <Card key={category.title} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                <CardTitle>{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {category.tools.map(tool => (
                  <li key={tool.name}>
                    <Link
                      href={tool.path}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                      <span className="text-primary">使用 →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 text-center">
        <p className="text-muted-foreground">
          内部项目 ·{" "}
          <a
            href="https://github.com/turinhub/atomix"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
