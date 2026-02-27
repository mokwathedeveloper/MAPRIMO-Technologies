"use server";

import { revalidatePath } from "next/cache";
import { 
  projectSchema, 
  testimonialSchema, 
  type ProjectFormData, 
  type TestimonialFormData 
} from "@/lib/validations";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { ActionResult } from "./result";
import { ZodError } from "zod";

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

function handleActionError(error: any): ActionResult {
  console.error("Action error:", error);
  
  if (error instanceof ZodError) {
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: "Validation failed",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  if (error.message === "AUTH") {
    return {
      ok: false,
      error: { code: "AUTH", message: "Unauthorized or insufficient permissions" },
    };
  }

  return {
    ok: false,
    error: { 
      code: "UNKNOWN", 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
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
      repo_url: formData.get("repo_url") || "",
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
        await supabase
          .from("projects")
          .update({ cover_url: publicUrl })
          .eq("id", project.id);
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
      repo_url: formData.get("repo_url") || "",
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
    
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
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
    
    const { error } = await supabase.from("posts").delete().eq("id", id);
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
    
    const projectId = formData.get("project_id") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;
    const results = JSON.parse(formData.get("results") as string);
    const screenshotFiles = formData.getAll("screenshots") as File[];

    const { data: caseStudy, error: insertError } = await supabase
      .from("case_studies")
      .insert({
        project_id: projectId,
        problem,
        solution,
        results,
        screenshots: [],
      })
      .select()
      .single();

    if (insertError) throw new Error(`DB:${insertError.message}`);

    const screenshotUrls: string[] = [];
    for (const file of screenshotFiles) {
      if (file.size > 0) {
        const url = await uploadFile(supabase, file, `portfolio/${projectId}/case-study`);
        screenshotUrls.push(url);
      }
    }

    if (screenshotUrls.length > 0) {
      await supabase
        .from("case_studies")
        .update({ screenshots: screenshotUrls })
        .eq("id", caseStudy.id);
    }

    revalidatePath("/admin/case-studies");
    revalidatePath("/work");
    return { ok: true, data: caseStudy };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult> {
  try {
    const supabase = await getAdminSupabase();
    if (!supabase) throw new Error("AUTH");
    
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) throw new Error(`DB:${error.message}`);
    
    revalidatePath("/admin/case-studies");
    revalidatePath("/work");
    return { ok: true, data: null };
  } catch (error) {
    return handleActionError(error);
  }
}
