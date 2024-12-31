'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing environment variables for Supabase')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file uploaded' }
  }

  const buffer = await file.arrayBuffer()
  const fileName = `${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('postcards')
    .upload(fileName, buffer)

  if (uploadError) {
    return { error: uploadError.message }
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

