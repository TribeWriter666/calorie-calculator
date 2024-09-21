import { useState, useEffect } from 'react'
import { nutritionTypes } from './ConsumedFood'

function ConsumptionHistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false)
  const [imageURL, setImageURL] = useState(null)

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

            <div className='container mb-2 d-flex justify-content-between gap-3'>
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
