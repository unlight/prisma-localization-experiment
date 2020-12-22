# prisma-localization-experiment

#### Option 1

```sh
rm -f prisma/dev.db && npx prisma db push --preview-feature --force --schema prisma/schema.prisma && npx ts-node src/seed
npx ts-node src/feed
```

#### Option 2

```sh
rm -f prisma/dev.db && npx prisma db push --preview-feature --force --schema prisma/schema2.prisma && npx ts-node src/seed2
npx ts-node src/feed2
```
