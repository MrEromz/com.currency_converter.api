import prisma from '../src/config/prisma';

async function main() {
    const alice = await prisma.authUser.upsert({
        where: {email: 'alice@prisma.io'},
        update: {},
        create: {
            email: 'alice@prisma.io',
            password_hash: 'Alice',
            profile: {
                create: {
                    firstname: 'Samuel',
                    lastname: 'Lastname',
                },
            },
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })