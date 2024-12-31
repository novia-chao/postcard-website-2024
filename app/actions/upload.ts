'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file uploaded' }
  }

  const buffer = await file.arrayBuffer()
  const fileName = `${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from('postcards')
    .upload(fileName, buffer)

  if (error) {
    return { error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('postcards')
    .getPublicUrl(fileName)

  // Save the image URL to your database
  const { error: insertError } = await supabase
    .from('postcards')
    .insert({ image_url: publicUrl, month: new Date().toLocaleString('default', { month: 'long' }) })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath('/')
  return { publicUrl }
}


