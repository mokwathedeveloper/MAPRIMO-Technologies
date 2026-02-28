"use server";

import { revalidatePath } from "next/cache";
import { 
  projectSchema, 
  testimonialSchema, 
  directorSchema,
  podcastSchema,
  caseStudySchema,
  type ProjectFormData, 
  type TestimonialFormData,
  type DirectorFormData,
  type PodcastFormData,
  type CaseStudyFormData
} from "@/lib/validations";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { ActionResult } from "./result";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

/**
 * Helper to get a hardened Supabase client with admin verification.
 */
async function getAdminSupabase() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
    
  if (!admin) return null;
  
  return supabase;
}

/**
 * Safe stringify for errors that might have circular references
 */
function safeStringify(x: unknown) {
  try {
    return JSON.stringify(x);
  } catch {
    return "[Unserializable error]";
  }
}

export async function handleActionError(err: any): Promise<ActionResult> {
  // Safe logging: never access deep properties or .value without guards
  try {
    if (err instanceof ZodError) {
      logger.error("Validation Error", err.flatten());
    } else if (err instanceof Error) {
      logger.error(err.message, err);
    } else {
      logger.error("Action error", typeof err === "string" ? { message: err } : { error: err });
    }
  } catch {
    logger.error("Action error: [Logging failed]");
  }
  
  // Return structured response
  if (err instanceof ZodError) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Validation failed. Please check the fields below.",
        fieldErrors: err.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  // Fallback for objects that look like ZodErrors but aren&apos;t instances
  if (err && typeof err === "object" && "issues" in err && Array.isArray(err.issues)) {
    try {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        if (issue.path && issue.path.length > 0) {
          const field = issue.path[0];
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(issue.message);
        }
      }
      return {
        ok: false,
        error: {
          code: "VALIDATION",
          message: "Validation failed. Please check the fields below.",
          fieldErrors,
        },
      };
    } catch (e) {
      // ignore parsing error, fallback to generic
    }
  }

  const message = err?.message || (typeof err === "string" ? err : "");

  if (message === "AUTH") {
    return {
      ok: false,
      error: { code: "AUTH", message: "Unauthorized or insufficient permissions" },
    };
  }

  if (typeof message === "string" && message.startsWith("DB:")) {
    return {
      ok: false,
      error: { code: "DB", message: message.replace("DB:", "") },
    };
  }

  if (typeof message === "string" && message.startsWith("STORAGE:")) {
    return {
      ok: false,
      error: { code: "STORAGE", message: message.replace("STORAGE:", "") },
    };
  }

  if (typeof message === "string" && message.startsWith("DB_UPDATE:")) {
    return {
      ok: false,
      error: { code: "DB", message: `Failed to update cover URL: ${message.replace("DB_UPDATE:", "")}` },
    };
  }

  return {
    ok: false,
    error: { 
      code: "UNKNOWN", 
      message: err instanceof Error ? err.message : "An unexpected error occurred" 
    },
  };
}

async function uploadFile(supabase: any, file: File, folder: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("projects")
    .upload(filePath, file);

  if (uploadError) throw new Error(`STORAGE:${uploadError.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from("projects")
    .getPublicUrl(filePath);

  return publicUrl;
}

async function deleteFileByUrl(supabase: any, url: string | null | undefined) {
  if (!url || typeof url !== 'string' || !url.includes('/projects/')) return;
  try {
    const parts = url.split('/projects/');
    if (parts.length === 2) {
      const filePath = parts[1];
      const { error } = await supabase.storage.from("projects").remove([filePath]);
      if (error) {
        logger.error(`Error deleting storage file ${filePath}`, error);
      } else {
        logger.info(`Successfully deleted storage file: ${filePath}`);
      }
    }
  } catch (e) {
    logger.error("Failed to delete storage file", e);
  }
}

export async function createProjectFromFormData(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("cover") as File;
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      summary: formData.get("summary"),
      stack: JSON.parse(formData.get("stack") as string),
      live_url: formData.get("live_url") || "",
      published: formData.get("published") === "true",
    };

    const validated = projectSchema.parse({ ...rawData, cover_url: "https://placeholder.com" });

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({ ...validated, cover_url: "" })
      .select()
      .single();

    if (insertError) throw new Error(`DB:${insertError.message}`);

    if (file && file.size > 0) {
      try {
        const publicUrl = await uploadFile(supabase, file, `portfolio/${project.id}`);
        const { error: updateError } = await supabase
          .from("projects")
          .update({ cover_url: publicUrl })
          .eq("id", project.id);
        if (updateError) throw new Error(`DB_UPDATE:${updateError.message}`);
      } catch (err) {
        await supabase.from("projects").delete().eq("id", project.id);
        throw err;
      }
    }

    revalidatePath("/admin/projects");
    revalidatePath("/work");
    return { ok: true, data: project };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("cover_image") as File | null;
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      summary: formData.get("summary"),
      stack: JSON.parse(formData.get("stack") as string),
      live_url: formData.get("live_url") || "",
      published: formData.get("published") === "true",
    };

    let cover_url = formData.get("current_cover_url") as string;

    if (file && file.size > 0) {
      cover_url = await uploadFile(supabase, file, `portfolio/${id}`);
    }

    const validated = projectSchema.parse({ ...rawData, cover_url });

    const { error } = await supabase
      .from("projects")
      .update(validated)
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/projects");
    revalidatePath("/work");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { data: project } = await supabase.from("projects").select("cover_url").eq("id", id).single();

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    if (project?.cover_url) {
      await deleteFileByUrl(supabase, project.cover_url);
    }
    
    revalidatePath("/admin/projects");
    revalidatePath("/work");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createTestimonial(data: TestimonialFormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const validated = testimonialSchema.parse(data);
    const { error } = await supabase.from("testimonials").insert(validated);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateTestimonial(id: string, data: TestimonialFormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const validated = testimonialSchema.parse(data);
    const { error } = await supabase
      .from("testimonials")
      .update(validated)
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/leads");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("featured_image") as File | null;
    let image_url = "";

    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      author: formData.get("author") || "MAPRIMO Team",
      published_at: new Date().toISOString(),
    };

    if (file && file.size > 0) {
      image_url = await uploadFile(supabase, file, "blog");
    }

    const { error } = await supabase.from("posts").insert({ ...rawData, image_url });
    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { data: post } = await supabase.from("posts").select("image_url").eq("id", id).single();

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    if (post?.image_url) {
      await deleteFileByUrl(supabase, post.image_url);
    }
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("featured_image") as File | null;
    let image_url = formData.get("current_image_url") as string;

    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      author: formData.get("author") || "MAPRIMO Team",
    };

    if (file && file.size > 0) {
      image_url = await uploadFile(supabase, file, "blog");
    }

    const { error } = await supabase
      .from("posts")
      .update({ ...rawData, image_url })
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createCaseStudy(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const coverFile = formData.get("cover") as File | null;
    const screenshotFiles = formData.getAll("screenshots") as File[];
    
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      client: formData.get("client"),
      summary: formData.get("summary"),
      problem: formData.get("problem"),
      solution: formData.get("solution"),
      results: JSON.parse(formData.get("results") as string || "[]"),
      tags: JSON.parse(formData.get("tags") as string || "[]"),
    };

    const validated = caseStudySchema.parse({ ...rawData, cover_url: "https://placeholder.com" });

    const { data: caseStudy, error: insertError } = await supabase
      .from("case_studies")
      .insert({ ...validated, cover_url: "", screenshots: [] })
      .select()
      .single();

    if (insertError) throw new Error(`DB:${insertError.message}`);

    let cover_url = "";
    if (coverFile && coverFile.size > 0) {
      cover_url = await uploadFile(supabase, coverFile, `case-studies/${caseStudy.id}/cover`);
    }

    const screenshotUrls: string[] = [];
    for (const file of screenshotFiles) {
      if (file && file.size > 0) {
        const url = await uploadFile(supabase, file, `case-studies/${caseStudy.id}/screenshots`);
        screenshotUrls.push(url);
      }
    }

    await supabase
      .from("case_studies")
      .update({ cover_url, screenshots: screenshotUrls })
      .eq("id", caseStudy.id);

    revalidatePath("/admin/case-studies");
    revalidatePath("/work");
    revalidatePath("/");
    return { ok: true, data: caseStudy };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { data: caseStudy } = await supabase.from("case_studies").select("cover_url, screenshots").eq("id", id).single();

    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    if (caseStudy) {
      if (caseStudy.cover_url) {
        await deleteFileByUrl(supabase, caseStudy.cover_url);
      }
      if (caseStudy.screenshots && Array.isArray(caseStudy.screenshots)) {
        for (const url of caseStudy.screenshots) {
          await deleteFileByUrl(supabase, url);
        }
      }
    }
    
    revalidatePath("/admin/case-studies");
    revalidatePath("/work");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateCaseStudy(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const coverFile = formData.get("cover") as File | null;
    const screenshotFiles = formData.getAll("screenshots") as File[];
    
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      client: formData.get("client"),
      summary: formData.get("summary"),
      problem: formData.get("problem"),
      solution: formData.get("solution"),
      results: JSON.parse(formData.get("results") as string || "[]"),
      tags: JSON.parse(formData.get("tags") as string || "[]"),
    };

    let cover_url = formData.get("current_cover_url") as string;
    let screenshots = JSON.parse(formData.get("current_screenshots") as string || "[]");

    if (coverFile && coverFile.size > 0) {
      cover_url = await uploadFile(supabase, coverFile, `case-studies/${id}/cover`);
    }

    const newScreenshotUrls: string[] = [];
    for (const file of screenshotFiles) {
      if (file && file.size > 0) {
        const url = await uploadFile(supabase, file, `case-studies/${id}/screenshots`);
        newScreenshotUrls.push(url);
      }
    }

    if (newScreenshotUrls.length > 0) {
      screenshots = [...screenshots, ...newScreenshotUrls];
    }

    const validated = caseStudySchema.parse({ ...rawData, cover_url });

    const { error } = await supabase
      .from("case_studies")
      .update({
        ...validated,
        screenshots,
      })
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);

    revalidatePath("/admin/case-studies");
    revalidatePath("/work");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createDirector(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("image") as File;
    const rawData = {
      name: formData.get("name"),
      role: formData.get("role"),
      bio: formData.get("bio"),
      linkedin_url: formData.get("linkedin_url") || "",
      twitter_url: formData.get("twitter_url") || "",
    };

    const validated = directorSchema.parse({ ...rawData, image_url: "https://placeholder.com" });

    const { data: director, error: insertError } = await supabase
      .from("directors")
      .insert({ ...validated, image_url: "" })
      .select()
      .single();

    if (insertError) throw new Error(`DB:${insertError.message}`);

    if (file && file.size > 0) {
      try {
        const publicUrl = await uploadFile(supabase, file, `directors/${director.id}`);
        const { error: updateError } = await supabase
          .from("directors")
          .update({ image_url: publicUrl })
          .eq("id", director.id);
        if (updateError) throw new Error(`DB_UPDATE:${updateError.message}`);
      } catch (err) {
        await supabase.from("directors").delete().eq("id", director.id);
        throw err;
      }
    }

    revalidatePath("/admin/directors");
    revalidatePath("/");
    return { ok: true, data: director };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteDirector(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { data: director } = await supabase.from("directors").select("image_url").eq("id", id).single();

    const { error } = await supabase.from("directors").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    if (director?.image_url) {
      await deleteFileByUrl(supabase, director.image_url);
    }
    
    revalidatePath("/admin/directors");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateDirector(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const file = formData.get("image") as File | null;
    const rawData = {
      name: formData.get("name"),
      role: formData.get("role"),
      bio: formData.get("bio"),
      linkedin_url: formData.get("linkedin_url") || "",
      twitter_url: formData.get("twitter_url") || "",
    };

    let image_url = formData.get("current_image_url") as string;

    if (file && file.size > 0) {
      image_url = await uploadFile(supabase, file, `directors/${id}`);
    }

    const validated = directorSchema.parse({ ...rawData, image_url });

    const { error } = await supabase
      .from("directors")
      .update(validated)
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/directors");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createPodcast(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const coverFile = formData.get("cover") as File;
    const audioFile = formData.get("audio") as File;
    const videoFile = formData.get("video") as File | null;
    
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      duration: formData.get("duration"),
      author: formData.get("author") || "MAPRIMO Team",
      youtube_url: formData.get("youtube_url") || "",
    };

    const validated = podcastSchema.parse({ 
      ...rawData, 
      cover_url: "https://placeholder.com",
      audio_url: "https://placeholder.com",
      video_url: "https://placeholder.com"
    });

    const { data: episode, error: insertError } = await supabase
      .from("podcasts")
      .insert({ ...validated, cover_url: "", audio_url: "", video_url: "" })
      .select()
      .single();

    if (insertError) throw new Error(`DB:${insertError.message}`);

    let cover_url = "";
    let audio_url = "";
    let video_url = "";

    try {
      if (coverFile && coverFile.size > 0) {
        cover_url = await uploadFile(supabase, coverFile, `podcasts/${episode.id}/cover`);
      }
      if (audioFile && audioFile.size > 0) {
        audio_url = await uploadFile(supabase, audioFile, `podcasts/${episode.id}/audio`);
      }
      if (videoFile && videoFile.size > 0) {
        video_url = await uploadFile(supabase, videoFile, `podcasts/${episode.id}/video`);
      }

      const { error: updateError } = await supabase
        .from("podcasts")
        .update({ cover_url, audio_url, video_url })
        .eq("id", episode.id);
      
      if (updateError) throw new Error(`DB_UPDATE:${updateError.message}`);
    } catch (err) {
      await supabase.from("podcasts").delete().eq("id", episode.id);
      throw err;
    }

    revalidatePath("/admin/podcasts");
    revalidatePath("/podcast");
    revalidatePath("/");
    return { ok: true, data: episode };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deletePodcast(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { data: podcast } = await supabase.from("podcasts").select("cover_url, audio_url, video_url").eq("id", id).single();

    const { error } = await supabase.from("podcasts").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    if (podcast) {
      if (podcast.cover_url) await deleteFileByUrl(supabase, podcast.cover_url);
      if (podcast.audio_url) await deleteFileByUrl(supabase, podcast.audio_url);
      if (podcast.video_url) await deleteFileByUrl(supabase, podcast.video_url);
    }
    
    revalidatePath("/admin/podcasts");
    revalidatePath("/podcast");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updatePodcast(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const coverFile = formData.get("cover") as File | null;
    const audioFile = formData.get("audio") as File | null;
    const videoFile = formData.get("video") as File | null;
    
    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      duration: formData.get("duration"),
      author: formData.get("author") || "MAPRIMO Team",
      youtube_url: formData.get("youtube_url") || "",
    };

    let cover_url = formData.get("current_cover_url") as string;
    let audio_url = formData.get("current_audio_url") as string;
    let video_url = formData.get("current_video_url") as string;

    if (coverFile && coverFile.size > 0) {
      cover_url = await uploadFile(supabase, coverFile, `podcasts/${id}/cover`);
    }
    if (audioFile && audioFile.size > 0) {
      audio_url = await uploadFile(supabase, audioFile, `podcasts/${id}/audio`);
    }
    if (videoFile && videoFile.size > 0) {
      video_url = await uploadFile(supabase, videoFile, `podcasts/${id}/video`);
    }

    const validated = podcastSchema.parse({ 
      ...rawData, 
      cover_url,
      audio_url,
      video_url 
    });

    const { error } = await supabase
      .from("podcasts")
      .update(validated)
      .eq("id", id);

    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/podcasts");
    revalidatePath("/podcast");
    revalidatePath("/");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}
