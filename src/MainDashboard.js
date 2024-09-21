import { useState } from 'react'
import { analyzeImage } from './analyzeImage' // Assuming we'll create this function

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64Image = reader.result.split(',')[1] // Extract base64 data

          // Call OpenAI API with the image
          const analysisResult = await analyzeImage(base64Image)

          const newEntry = {
            id: Date.now(),
            image: reader.result,
            timestamp: new Date().toLocaleString(),
            analysis: analysisResult,
          }
          setEntries((prev) => [newEntry, ...prev])
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error uploading image:', error)
        setIsUploading(false)
      }
    }
  }

  return (
    <div className='container py-4'>
      <h1 className='mb-4'>How much did you eat today?</h1>

      <div className='card mb-4'>
        <div className='card-body'>
          <div className='d-flex justify-content-center'>
            <input
              id='image-upload'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='d-none'
              aria-label='Upload food image'
            />
            <button
              onClick={() => document.getElementById('image-upload').click()}
              disabled={isUploading}
              className={`btn ${isUploading ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isUploading ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    className='bi bi-plus me-2'
                    width='1em'
                    height='1em'
                    viewBox='0 0 16 16'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'
                    />
                  </svg>
                  Upload Food Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-6 mb-4'>
          <h2 className='h4 mb-3'>Food Log</h2>
          <div className='card' style={{ height: '400px', overflowY: 'auto' }}>
            <ul className='list-group list-group-flush'>
              {entries.map((entry) => (
                <li key={entry.id} className='list-group-item'>
                  <div className='d-flex align-items-center'>
                    <img
                      src={entry.image}
                      alt={`Food entry from ${entry.timestamp}`}
                      className='me-3'
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <p className='mb-0 fw-bold'>Food Entry</p>
                      <small className='text-muted'>{entry.timestamp}</small>
                      <p className='mt-2'>{entry.analysis}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='col-md-6'>
          <h2 className='h4 mb-3'>Image Gallery</h2>
          <div className='row row-cols-3 g-3'>
            {entries.map((entry) => (
              <div key={entry.id} className='col'>
                <img
                  src={entry.image}
                  alt={`Food entry from ${entry.timestamp}`}
                  className='img-fluid rounded'
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
