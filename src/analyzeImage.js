import OpenAI from 'openai' // Make sure to install the openai package

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Store your API key in .env file
  dangerouslyAllowBrowser: true,
})

export async function analyzeImage(base64Image) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use the appropriate model
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image and estimate its caloric content and nutritional value.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    })

    console.log('OpenAI API Response:', response)
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error analyzing image:', error)
    return 'Unable to analyze image'
  }
}
