import { publish } from "@/lib/events";

// ...

await prisma.activityScore.createMany({
   ...
});

publish();