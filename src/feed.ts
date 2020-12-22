import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: [
        {
            level: 'query',
            emit: 'event',
        },
    ],
});

// @ts-ignore
prisma.$on('query', (event: any) => {
    const params: any[] = JSON.parse(event.params);
    const query = (event.query as string).replace(/\?/g, (s) => {
        return `\u001B[90m${JSON.stringify(params.shift())}\u001B[0m\u001B[96m`;
    });
    console.log(`\u001B[96m${query}\u001B[0m`);
});

async function main() {
    // Get all
    const feed = await prisma.post.findUnique({
        include: {
            titleLocalization: true,
            bodyLocalization: true,
        },
        where: {
            postId: 1,
        },
    });
    console.log('feed', feed);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
