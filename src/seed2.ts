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
            localization: {
                create: [
                    {
                        value: 'regatta rus',
                        language: 'RU',
                        field: 'name',
                        model: 'Category',
                    },
                    {
                        value: 'regatta ger',
                        language: 'DE',
                        field: 'name',
                        model: 'Category',
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
            body:
                'underdevelopment sponsalia forthgaze unefficacious sacrosecular upness',
            localization: {
                create: [
                    {
                        value: 'Крутой пост',
                        language: 'RU',
                        field: 'title',
                        model: 'Post',
                    },
                    {
                        value: 'Awessome mag',
                        language: 'DE',
                        field: 'title',
                        model: 'Post',
                    },
                    {
                        value: 'Ru Oriskanian Ru nauseate Ru ollenite',
                        language: 'RU',
                        field: 'body',
                        model: 'Post',
                    },
                    {
                        value:
                            'De nitrobarite De nonconnotative De cusparidine',
                        language: 'DE',
                        field: 'body',
                        model: 'Post',
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
