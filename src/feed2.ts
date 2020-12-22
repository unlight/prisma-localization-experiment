import { PrismaClient } from '@prisma/client';
import { util } from 'prettier';
import { inspect } from 'util';

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
    console.log('Get all');
    const feed = await prisma.post.findUnique({
        include: {
            localizations: true,
            category: {
                include: {
                    localizations: true,
                },
            },
        },
        where: {
            postId: 1,
        },
    });
    console.log(feed);

    console.log('Get on specific language');
    const feed2 = await prisma.post.findMany({
        include: {
            localizations: {
                select: {
                    // language: true,
                    field: true,
                    value: true,
                },
                where: {
                    language: 'DE',
                },
            },
            category: {
                include: {
                    localizations: {
                        select: {
                            // language: true,
                            field: true,
                            value: true,
                        },
                        where: {
                            language: 'DE',
                        },
                    },
                },
            },
        },
        where: {
            localizations: {
                some: {
                    language: { equals: 'DE' },
                },
            },
        },
    });

    console.log(inspect(feed2, undefined, null));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
