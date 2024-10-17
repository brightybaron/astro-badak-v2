import { prisma } from "@lib/prisma";

export async function GET(req: Request) {
  try {
    // Fetch all posts and their related images using Prisma
    const posts = await prisma.post.findMany({
      include: {
        images: true, // Fetch related images for each post
      },
      orderBy: {
        updatedAt: "asc", // Order by latest updated posts
      },
    });

    // If no posts are found, return a 404 response
    if (!posts.length) {
      return new Response(JSON.stringify({ message: "No posts found" }), {
        status: 404,
      });
    }

    // Return the posts with their images
    return new Response(JSON.stringify(posts), {
      status: 200,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
