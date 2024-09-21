import { useState } from 'react'
import { useDB } from './DBProvider'
import { analyzeImage } from './analyzeImage'

export default function UploadImage({ setUploading }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [imageID, setImageID] = useState(null)
  const [base64Image, setBase64Image] = useState(null)
  const db = useDB()
  const [fileState, setFileState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result) // Resolve the promise with the Base64 string
      }
      reader.onerror = reject // Handle errors

      reader.readAsDataURL(file) // Read file as Base64 URL
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFileState(file)
    if (file && file.type.startsWith('image/')) {
      if (previewURL) {
        URL.revokeObjectURL(previewURL)
        setPreviewURL(null)
      }

      setSelectedImage(file)
      {
        /*TODO: free it when necessary */
      }
      const imageUrl = URL.createObjectURL(file)
      setPreviewURL(imageUrl)
    } else {
      alert('Please select a valid image file')
    }
  }

  const calculateImage = async (e) => {
    setIsLoading(true)
    setUploading(true)
    if (!selectedImage) {
      alert('Please select an image first')
      setIsLoading(false)
      setUploading(false)
    } else {
      try {
        if (fileState) {
          const base64Data = await fileToBase64(fileState)
          const result = await analyzeImage(base64Data)

          const uploadDateTime = new Date().toISOString()
          const dataToStore = {
            ...result,
            uploadDateTime: uploadDateTime,
            imageBlob: fileState, // Store the image file as a Blob
          }

          const id = await db.addItem(dataToStore)
          console.log('Inserted Data id is ' + id)
        }
      } catch (error) {
        console.error('Error processing image:', error)
        alert('An error occurred while processing the image. Please try again.')
      } finally {
        setIsLoading(false)
        setUploading(false)
      }
    }
  }

  return (
    <div className='mt-4'>
      <div className='w-100'>
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title mb-4'>Upload Image</h5>
            <div className='mb-3'>
              {previewURL && (
                <div className='mb-3 text-center'>
                  <img
                    src={previewURL}
                    alt='image preview'
                    className='img-fluid'
                    style={{ maxHeight: '30vh' }}
                  />
                </div>
              )}
              <label
                htmlFor='file-upload'
                className='btn btn-outline-primary w-100'
              >
                {previewURL ? 'Change Image' : 'Choose an Image'}
              </label>
              <input
                id='file-upload'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='d-none'
              />
            </div>

            <button
              onClick={calculateImage}
              className='btn btn-primary w-100'
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  Calculating...
                </>
              ) : (
                'Calculate My Nutrition'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
