"use server";

import { revalidatePath } from "next/cache";
import { projectSchema, testimonialSchema, type ProjectFormData, type TestimonialFormData } from "@/lib/validations";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function uploadImage(supabase: any, file: File, path: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  return publicUrl;
}

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
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle error (happens in Server Components)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle error
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");
  
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
    
  if (!admin) throw new Error("Forbidden: Admin access required");
  
  return supabase;
}

export async function createProject(data: ProjectFormData) {
  const supabase = await getAdminSupabase();
  const validated = projectSchema.parse(data);

  const { data: project, error } = await supabase
    .from("projects")
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  return project;
}

export async function updateProject(id: string, data: ProjectFormData) {
  const supabase = await getAdminSupabase();
  const validated = projectSchema.parse(data);

  const { data: project, error } = await supabase
    .from("projects")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/projects");
  revalidatePath(`/work/${project.slug}`);
  revalidatePath("/work");
  return project;
}

export async function deleteProject(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/projects");
  revalidatePath("/work");
}

export async function createTestimonial(data: TestimonialFormData) {
  const supabase = await getAdminSupabase();
  const validated = testimonialSchema.parse(data);

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteLead(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/leads");
}

export async function createPost(data: any) {
  const supabase = await getAdminSupabase();
  
  const { data: post, error } = await supabase
    .from("posts")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return post;
}

export async function updatePost(id: string, data: any) {
  const supabase = await getAdminSupabase();

  const { data: post, error } = await supabase
    .from("posts")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  return post;
}

export async function deletePost(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
