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
    // Create categories
    const category1 = await prisma.category.create({
        data: {
            name: 'regatta',
            nameLocalization: {
                create: [
                    {
                        value: 'regatta rus',
                        language: 'RU',
                    },
                    {
                        value: 'regatta ger',
                        language: 'DE',
                    },
                ],
            },
        },
    });
    await prisma.post.create({
        data: {
            category: {
                connect: {
                    categoryId: category1.categoryId,
                },
            },
            title: 'Awesome Post',
            titleLocalization: {
                create: [
                    {
                        value: 'Крутой пост',
                        language: 'RU',
                    },
                    {
                        value: 'Awessome mag',
                        language: 'DE',
                    },
                ],
            },
            body:
                'underdevelopment sponsalia forthgaze unefficacious sacrosecular upness',
            bodyLocalization: {
                create: [
                    {
                        value: 'Ru Oriskanian Ru nauseate Ru ollenite',
                        language: 'RU',
                    },
                    {
                        value:
                            'De nitrobarite De nonconnotative De cusparidine',
                        language: 'DE',
                    },
                ],
            },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
