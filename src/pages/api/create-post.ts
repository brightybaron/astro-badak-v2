import { prisma } from "@lib/prisma";
import { supabase } from "@lib/supabase"; // Import your Supabase instance
import { z } from "zod";

// const UploadSchema = z
//   .object({
//     title: z.string().min(1, "Title is required"),
//     jenistrip: z.string().min(1, "Jenis Trip is required"),
//     mepo: z.string().min(1, "Mepo is required"),
//     destinasi: z
//       .array(z.string().min(1, "Destinasi is required"))
//       .min(1, "Destinasi is required"),
//     include: z
//       .array(z.string().min(1, "Include is required"))
//       .min(1, "Include is required"),
//     exclude: z
//       .array(z.string().min(1, "Exclude is required"))
//       .min(1, "Exclude is required"),
//     prices: z
//       .array(z.string().min(1, "Prices is required"))
//       .min(1, "Prices is required"),
//     description: z
//       .array(z.string().min(1, "Description is required"))
//       .min(1, "Description is required"),
//     itinerary: z
//       .array(z.string().min(1, "Itinerary is required"))
//       .min(1, "Itinerary is required"),
//     photos: z
//       .array(z.string().min(1, "Photos is required"))
//       .min(1, "Photos is required"),
//   })
//   .required();

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
    const photos = formData.getAll("photos");

    if (!Array.isArray(photos) || photos.length === 0) {
      return new Response(JSON.stringify({ message: "No images provided" }), {
        status: 400,
      });
    }

    // Store images in Supabase (parallel upload)
    const uploadedImages = await Promise.all(
      photos.map(async (file) => {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(
            `${title
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .trim()
              .replace(/\s+/g, "-")}/${file.name}`,
            file,
            { upsert: true, cacheControl: "3600" }
          );

        if (uploadError) {
          console.error("Supabase upload error:", uploadError.message);
          throw new Error("Failed to upload image to Supabase");
        }

        return { url: uploadData?.path };
      })
    );

    // Create post in Prisma
    const newPost = await prisma.post.create({
      data: {
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
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
