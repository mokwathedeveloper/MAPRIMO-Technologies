"use server";

import { revalidatePath } from "next/cache";
import { projectSchema, testimonialSchema, type ProjectFormData, type TestimonialFormData } from "@/lib/validations";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
