import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.imgbbApiKey
  
  if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY_HERE') {
    throw createError({ statusCode: 500, message: 'ImgBB API key is missing in .env' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const imageField = formData.find(f => f.name === 'image')
  if (!imageField) {
    throw createError({ statusCode: 400, message: 'Image field is missing' })
  }

  // Convert binary buffer to base64 for ImgBB
  const base64Image = imageField.data.toString('base64')
  
  const body = new URLSearchParams()
  body.append('key', apiKey)
  body.append('image', base64Image)

  try {
    const response = await $fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return { success: true, url: response.data.url }
  } catch (error) {
    console.error('ImgBB error:', error)
    throw createError({ statusCode: 500, message: 'Failed to upload to ImgBB' })
  }
})
