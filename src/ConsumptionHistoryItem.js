import { useState, useEffect } from 'react'
import { nutritionTypes } from './ConsumedFood'
import { analyzeImage } from './analyzeImage'

function ConsumptionHistoryItem({ item, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [imageURL, setImageURL] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editDescription, setEditDescription] = useState(item.description)

  const [isUploading, setIsUploading] = useState(false)

  console.log('Rendering ConsumptionHistoryItem, isUploading:', isUploading) // Debug log

  console.log('ConsumptionHistoryItem received item:', item) // Add this line

  useEffect(() => {
    if (item.imageURL) {
      setImageURL(item.imageURL)
    }
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL)
      }
    }
  }, [item.imageURL, imageURL])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
    return `${day} ${month}`
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditDescription(item.description)
  }

  const handleUpdate = async () => {
    setIsUploading(true)
    console.log('Setting isUploading to true') // Debug log

    try {
      // Convert image URL to base64
      const response = await fetch(item.imageURL)
      const blob = await response.blob()
      const reader = new FileReader()

      reader.onloadend = async () => {
        const base64data = reader.result

        const updatedAnalysis = await analyzeImage(base64data, editDescription)
        if (updatedAnalysis) {
          // Include the imageBlob in the update
          onUpdate({ ...item, ...updatedAnalysis, imageBlob: item.imageBlob })
          setIsEditing(false)
        } else {
          console.error('Failed to update analysis')
        }

        setIsUploading(false)
        console.log('Setting isUploading to false') // Debug log
      }

      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error updating entry:', error)
      setIsUploading(false)
      console.log('Setting isUploading to false due to error') // Debug log
    }
  }

  useEffect(() => {
    console.log('isUploading changed:', isUploading) // Debug log
  }, [isUploading])

  const handleDelete = () => {
    console.log('Deleting item:', item) // Add this line
    onDelete(item.id)
  }

  return (
    <div
      className='d-flex align-items-center'
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <div className='flex-grow-1'>
        {expanded ? (
          <>
            <button
              className='btn m-0 d-flex w-100 justify-content-between'
              onClick={() => setExpanded(false)}
            >
              <span>
                <span className='opacity-50 me-2'>
                  {formatDate(item.uploadDateTime)}
                </span>
                <span className='fw-semibold'>{item.name}</span>
              </span>
              <span>
                <i className='bi bi-chevron-bar-up'></i>
              </span>
            </button>

            <div className='container d-flex justify-content-between gap-3'>
              <div>
                <div className='row'>
                  <div className='col-12'>
                    <p className='m-0 d-flex mb-2'>
                      <span>{item.description}</span>
                    </p>
                    <p className='m-0 d-flex justify-content-between'>
                      <strong>Calories</strong>
                      <span>{item.calories}</span>
                    </p>
                    <p className='m-0 d-flex justify-content-between'>
                      <strong>Serving Size</strong>
                      <span>{item.serving_size}</span>
                    </p>
                    <p className='m-0 d-flex justify-content-between'>
                      <strong>Confidence Score</strong>
                      <span>{item.confidence_score.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <div className='row mt-2'>
                  <div className='col-12'>
                    <p className='m-0'>
                      <strong>Macronutrients</strong>
                    </p>
                    {nutritionTypes.map((type) => (
                      <p
                        key={type.name}
                        className='m-0 d-flex justify-content-between'
                      >
                        <span>{type.displayName}</span>
                        <span>
                          {item.nutritions[type.name]} {type.unit}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className='row mt-2'>
                  <div className='col-12'>
                    <p className='m-0 d-flex justify-content-between'>
                      <strong>Equivalent walking time</strong>
                      <span>
                        {item.exercise_equivalent.walking_minutes} minutes
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {imageURL && (
                <div
                  style={{
                    flexShrink: 0,
                    width: 'min(40%, 250px)',
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img
                    src={imageURL}
                    alt={item.name}
                    className='img-fluid'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              )}
            </div>

            <div className='container mb-2'>
              {isEditing ? (
                <div className='mt-3'>
                  <input
                    type='text'
                    className='form-control mb-2'
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    disabled={isUploading}
                  />
                  <button
                    className='btn btn-primary me-2 btn-sm'
                    onClick={handleUpdate}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span
                          className='spinner-border spinner-border-sm me-2'
                          role='status'
                          aria-hidden='true'
                        ></span>
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                  <button
                    className='btn btn-secondary btn-sm'
                    onClick={() => setIsEditing(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className='mt-3'>
                  <button
                    className='btn btn-outline-primary me-2 btn-sm'
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-outline-danger btn-sm'
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className='btn m-0 d-flex w-100 justify-content-between'
            onClick={() => setExpanded(true)}
          >
            <div className='d-flex gap-2'>
              <span className='opacity-50'>
                {formatDate(item.uploadDateTime)}
              </span>
              {imageURL && (
                <div
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img
                    src={imageURL}
                    alt={item.name}
                    className='img-fluid'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              )}
              <span>{item.name}</span>
            </div>

            <span className=''>{item.calories} Cal</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ConsumptionHistoryItem
