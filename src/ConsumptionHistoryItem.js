import { useState } from 'react'
import { nutritionTypes } from './ConsumedFood'

function ConsumptionHistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
    return `${day} ${month}`
  }

  return (
    <div
      className='d-flex flex-column'
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      {expanded ? (
        <>
          <button
            className='btn m-0 d-flex w-100 justify-content-between'
            onClick={() => setExpanded(false)}
          >
            <span>
              <span className='opacity-50 me-2 '>
                {formatDate(item.uploadDateTime)}
              </span>
              <span className='fw-semibold'>{item.name}</span>
            </span>
            <span>
              <i className='bi bi-chevron-bar-up'></i>
            </span>
          </button>

          <div className='container mb-2'>
            <div className='row'>
              <div className='col-12'>
                <p className='m-0 d-flex mb-2'>
                  <span>{item.description}</span>
                </p>
                <p className='m-0 d-flex justify-content-between'>
                  <strong>Calories:</strong>
                  <span>{item.calories}</span>
                </p>
                <p className='m-0 d-flex justify-content-between'>
                  <strong>Serving Size:</strong>
                  <span>{item.serving_size}</span>
                </p>
                <p className='m-0 d-flex justify-content-between'>
                  <strong>Confidence Score:</strong>
                  <span>{item.confidence_score.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div className='row mt-2'>
              <div className='col-12'>
                <p className='m-0'>
                  <strong>Macronutrients:</strong>
                </p>
                {nutritionTypes.map((type) => (
                  <p
                    key={type.name}
                    className='m-0 d-flex justify-content-between'
                  >
                    <span>{type.displayName}:</span>
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
                  <strong>Equivalent walking time:</strong>
                  <span>
                    {item.exercise_equivalent.walking_minutes} minutes
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <button
          className='btn m-0 d-flex w-100 justify-content-between'
          onClick={() => setExpanded(true)}
        >
          <span>
            <span className='opacity-50 me-2 '>
              {formatDate(item.uploadDateTime)}
            </span>
            <span>{item.name}</span>
          </span>

          <span className=''>{item.calories} Cal</span>
        </button>
      )}
    </div>
  )
}

export default ConsumptionHistoryItem
