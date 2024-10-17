import { prisma } from "@lib/prisma";
import { supabase } from "@lib/supabase";

// Helper function to handle form data parsing
const parseFormData = (formData: FormData) => {
  const title = formData.get("title") as string;
  const jenistrip = formData.get("jenistrip") as string;
  const mepo = formData.get("mepo") as string;
  const destinasi = parseCommaSeparatedValues(
    formData.get("destinasi") as string
  );
  const include = parseCommaSeparatedValues(formData.get("include") as string);
  const exclude = parseCommaSeparatedValues(formData.get("exclude") as string);
  const prices = parseCommaSeparatedValues(formData.get("prices") as string);
  const itineraries = JSON.parse(formData.get("itinerary") as string);
  const descriptions = JSON.parse(formData.get("description") as string);
  const photos = formData.getAll("photos") as File[];

  return {
    title,
    jenistrip,
    mepo,
    destinasi,
    include,
    exclude,
    prices,
    itineraries,
    descriptions,
    photos,
  };
};

// Helper function to parse comma-separated values
const parseCommaSeparatedValues = (input: string) => {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

// Helper function to upload images to Supabase
const uploadImagesToSupabase = async (title: string, photos: File[]) => {
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
  return uploadedImages;
};

// Helper function to create a new post in Prisma
const createPostInPrisma = async (data: {
  title: string;
  jenistrip: string;
  mepo: string;
  destinasi: string[];
  include: string[];
  exclude: string[];
  prices: string[];
  itineraries: any;
  descriptions: any;
  uploadedImages: { url: string }[];
}) => {
  const newPost = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
      jenistrip: data.jenistrip,
      mepo: data.mepo,
      destinasi: data.destinasi,
      include: data.include,
      exclude: data.exclude,
      prices: data.prices,
      descriptions: data.descriptions,
      itineraries: data.itineraries,
      images: {
        create: data.uploadedImages,
      },
    },
  });
  return newPost;
};

// Main function to handle upload content
export const uploadContent = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const {
      title,
      jenistrip,
      mepo,
      destinasi,
      include,
      exclude,
      prices,
      itineraries,
      descriptions,
      photos,
    } = parseFormData(formData);

    if (!Array.isArray(photos) || photos.length === 0) {
      return new Response(JSON.stringify({ message: "No images provided" }), {
        status: 400,
      });
    }

    const uploadedImages = await uploadImagesToSupabase(title, photos);
    const newPost = await createPostInPrisma({
      title,
      jenistrip,
      mepo,
      destinasi,
      include,
      exclude,
      prices,
      itineraries,
      descriptions,
      uploadedImages,
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
};
