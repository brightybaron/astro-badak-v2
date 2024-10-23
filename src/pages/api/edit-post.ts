import { getContentBySlug } from "@lib/data";
import { prisma } from "@lib/prisma";
import { supabase } from "@lib/supabase";
import { slugify } from "@lib/utils";

export async function PUT({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const jenistrip = formData.get("jenistrip");
  const mepo = formData.get("mepo");
  const destinasi = formData
    .get("destinasi")
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d !== "");
  const include = formData
    .get("include")
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d !== "");
  const exclude = formData
    .get("exclude")
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d !== "");
  const prices = formData
    .get("prices")
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d !== "");
  const itineraries = JSON.parse(formData.get("itinerary"));
  const descriptions = JSON.parse(formData.get("description"));

  // Generate slug

  const slug = slugify(title);

  const currentPost = await getContentBySlug(slug);

  if (!currentPost) {
    return new Response(JSON.stringify({ message: "Post not found" }), {
      status: 404,
    });
  }

  // Check if the title has changed
  const newSlug =
    title !== currentPost.title ? slugify(title) : currentPost.slug;

  // Handle image deletion
  const imagesToDelete = formData.getAll("imagesToDelete");
  const imagesToDeleteRecords = await prisma.image.findMany({
    where: { url: { in: imagesToDelete } },
  });

  if (imagesToDeleteRecords.length > 0) {
    await Promise.all(
      imagesToDeleteRecords.map(async (image) => {
        const { error: deleteError } = await supabase.storage
          .from("uploads")
          .remove([image.url]);

        if (!deleteError) {
          await prisma.image.delete({
            where: { id: image.id },
          });
        }
      })
    );
  }

  const newPhotos = formData.getAll("photos");
  let uploadedImages = [];
  if (newPhotos.length > 0) {
    uploadedImages = await Promise.all(
      newPhotos.map(async (file) => {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(`${slug}/${file.name}`, file, {
            upsert: true,
            cacheControl: "3600",
          });

        if (uploadError) {
          throw new Error("Failed to upload image");
        }

        return { url: uploadData?.path };
      })
    );
  }

  try {
    // Update post
    const updatedPost = await prisma.post.update({
      where: { slug: currentPost.slug },
      data: {
        title,
        slug: newSlug,
        jenistrip,
        mepo,
        destinasi,
        include,
        exclude,
        prices,
        descriptions,
        itineraries,
        images: {
          deleteMany: {
            id: { in: imagesToDeleteRecords.map((img) => img.id) },
          },
          create: newPhotos.length > 0 ? uploadedImages : undefined,
        },
      },
    });

    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update post",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
