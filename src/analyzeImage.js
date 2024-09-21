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
          role: 'system',
          content:
            'You are a helpful assistant that analyzes food images and provides nutritional information.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image and provide information in the specified JSON format.',
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
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'food_analysis',
          schema: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              calories: { type: 'number' },
              serving_size: { type: 'string' },
              confidence_score: { type: 'number' },
              macronutrients: {
                type: 'object',
                properties: {
                  protein: { type: 'string' },
                  carbohydrates: { type: 'string' },
                  fats: { type: 'string' },
                  fiber: { type: 'string' },
                },
                required: ['protein', 'carbohydrates', 'fats', 'fiber'],
                additionalProperties: false,
              },
              exercise_equivalent: {
                type: 'object',
                properties: {
                  walking_minutes: { type: 'number' },
                  notes: { type: 'string' },
                },
                required: ['walking_minutes', 'notes'],
                additionalProperties: false,
              },
            },
            required: [
              'description',
              'calories',
              'serving_size',
              'confidence_score',
              'macronutrients',
              'exercise_equivalent',
            ],
            additionalProperties: false,
          },
          strict: true,
        },
      },
      max_tokens: 500,
    })

    console.log('OpenAI API Response:', response)

    if (response.choices[0].message.refusal) {
      console.log(
        'Model refused to respond:',
        response.choices[0].message.refusal
      )
      return 'Model refused to analyze the image.'
    }

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Error analyzing image:', error)
    return 'Unable to analyze image'
  }
}
