import getUserId from "../utils/getUserId";

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first:args.first,
            skip: args.skip
        }
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {
            first:args.first,
            skip: args.skip,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
        }

        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, {prisma }, info) {
        return prisma.query.comments(null , info)
    },

    async post(parent , args ,{prisma , request} , info ) {
         const userId = getUserId(request , false)
         const posts = await prisma.query.posts({
             where: {
                 id: args.id,
                 OR: [{
                     published: true
                 },{
                     author: {
                         id: userId
                     }
                 }]
             }
         } , info)

         if (posts.length === 0) {
             throw new Error('Post Not Found')
         }
        
         return posts[0] 
    },
    async user(parent , args , {prisma , request} , info) {
        const userId = getUserId(request , true)
      
        const users = await prisma.query.users({where:{id: args.id}}, info)
        if (users.length === 0 ) {
            throw new Error('User Not Found')
        }

        return users[0]
    },
    async myPosts(parent , args , {prisma , request} , info) {
        const userId = getUserId(request , true)
        const opArgs = {
            where:{
                author:{
                    id:userId
                }
            }
        }

        if(args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            },{
                body_contains:args.query
            }]
        }

        const posts  = await prisma.query.posts(opArgs , info)
        
        if (posts.length === 0) {
            throw new Error('Posts not found')
        }

        return posts
    }
}

export { Query as default }