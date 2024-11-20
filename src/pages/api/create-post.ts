import { prisma } from "@lib/prisma";
import { supabase } from "@lib/supabase";
import { slugify } from "@lib/utils";

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const jenistrip = formData.get("jenistrip");
    const mepo = formData.get("mepo");
    const destinasi = (formData.get("destinasi") as string)
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d !== "");
    const include = (formData.get("include") as string)
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d !== "");
    const exclude = (formData.get("exclude") as string)
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d !== "");
    const prices = (formData.get("prices") as string)
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d !== "");
    const itineraries = JSON.parse(formData.get("itinerary") as string);
    const descriptions = JSON.parse(formData.get("description") as string);
    const slug = slugify(title);

    const photos = formData.getAll("photos");
    if (!Array.isArray(photos) || photos.length === 0) {
      return new Response(JSON.stringify({ message: "No images provided" }), {
        status: 400,
      });
    }

    if (Array.isArray(photos) && photos.length > 6) {
      return new Response(
        JSON.stringify({ message: "You can only upload up to 6 images" }),
        { status: 400 }
      );
    }

    // Store images in Supabase (parallel upload)
    let uploadedImages: { url: string }[] = [];
    if (Array.isArray(photos) && photos.length > 0) {
      uploadedImages = await Promise.all(
        photos.map(async (file) => {
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("uploads")
              .upload(`${slug}/${file.name}`, file, {
                upsert: true,
                cacheControl: "3600",
              });

          if (uploadError) {
            console.error("Supabase upload error:", uploadError.message);
            throw new Error("Failed to upload image to Supabase");
          }

          return { url: uploadData?.path };
        })
      );
    }
    // const uploadedImages = await Promise.all(
    //   photos.map(async (file) => {
    //     const { data: uploadData, error: uploadError } = await supabase.storage
    //       .from("uploads")
    //       .upload(`slugify(${slug})/${file.name}`, file, {
    //         upsert: true,
    //         cacheControl: "3600",
    //       });

    //     if (uploadError) {
    //       console.error("Supabase upload error:", uploadError.message);
    //       throw new Error("Failed to upload image to Supabase");
    //     }

    //     return { url: uploadData?.path };
    //   })
    // );

    // Create post in Prisma
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        jenistrip,
        mepo,
        destinasi,
        include,
        exclude,
        prices,
        descriptions,
        itineraries,
        images: {
          create: uploadedImages,
        },
      },
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to create post",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
