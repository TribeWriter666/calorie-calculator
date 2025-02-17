import OpenAI from 'openai' // Make sure to install the openai package

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Store your API key in .env file
  dangerouslyAllowBrowser: true,
})

export const analyzeImage = async (dataURL, description = '') => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06', // Use the appropriate model
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that analyzes food images and provides nutritional information. If user input provided, use it to analyze the image so that you can provide a more accurate analysis.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food image and provide information in the specified JSON format. ${
                description ? 'user input: ' + description : ''
              }`,
            },
            {
              type: 'image_url',
              image_url: {
                url: dataURL,
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
              food_name: { type: 'string' },
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
              'food_name',
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
      temperature: 0.5,
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
