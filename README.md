# prisma-localization-experiment

Where localization is partial. For example,

### Option 1

```sh
rm -f prisma/dev.db && npx prisma db push --preview-feature --force --schema prisma/schema.prisma && npx ts-node src/seed
npx ts-node src/feed
```

```prisma
model Post {
  postId    Int     @id @default(autoincrement())
  title     String
  titleLocalizations Localization[] @relation(name: "TitleLocalizations")
  body String
  bodyLocalizations Localization[] @relation(name: "BodyLocalizations")
  categoryId Int?
  category Category? @relation(fields: [categoryId], references: [categoryId])
}

model Category {
  categoryId Int @id @default(autoincrement())
  name String
  nameLocalizations Localization[]
  posts Post[]
}

model Localization {
    localizationId Int @id @default(autoincrement())
    language String // Enum
    value String
    titlePostId Int?
    titlePost Post? @relation(name: "TitleLocalizations", fields: [titlePostId])
    bodyPostId Int?
    bodyPost Post? @relation(name: "BodyLocalizations", fields: [bodyPostId])
}
```

#### Pros/Cons

-   [-] Too explicit
-   [-] Several loops to attach localized fields

### Option 2

```sh
rm -f prisma/dev.db && npx prisma db push --preview-feature --force --schema prisma/schema2.prisma && npx ts-node src/seed2
npx ts-node src/feed2
```

```prisma
model Post {
  postId    Int     @id @default(autoincrement())
  localizations Localization[]
  title     String
  body String
  categoryId Int?
  category Category? @relation(fields: [categoryId], references: [categoryId])
}

model Category {
  categoryId Int @id @default(autoincrement())
  localizations Localization[]
  name String
  posts Post[]
}

model Localization {
    localizationId Int @id @default(autoincrement())
    language String // Enum
    field String
    value String
    postId Int?
    post Post? @relation(fields: [postId], references: [postId])
    categoryId Int?
    category Category? @relation(fields: [categoryId], references: [categoryId])
}
```

#### Pros/Cons

-   [-] Single loop to attach localized fields
