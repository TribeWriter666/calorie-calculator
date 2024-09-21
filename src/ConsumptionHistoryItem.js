import { useState } from "react";
import { nutritionTypes } from "./ConsumedFood";

function ConsumptionHistoryItem({item}) {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <div className='d-flex flex-column'>
        <button className='btn m-0 d-flex w-100 justify-content-between' onClick={() => setExpanded(false)}>
          <span className="fw-semibold">{item.name}</span>
          <span><i className="bi bi-chevron-bar-up"></i></span>
        </button>

        <div className="container mb-2">
          {nutritionTypes.map((type) => 
            <p className="m-0 d-flex justify-content-between">
              <span>{type.displayName}:</span>
              <span>{item.nutritions[type.name] || 0} {type.unit}</span>
            </p>
          )}
        </div>
      </div>
    );

  } else {
    return (
      <button className="btn m-0 d-flex w-100 justify-content-between" onClick={() => setExpanded(true)}>
        <span>{item.name}</span>
        <span>{item.calories} Cal</span>
      </button>
    );
  }
}

export default ConsumptionHistoryItem;