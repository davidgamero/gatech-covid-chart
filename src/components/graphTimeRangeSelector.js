import React from 'react'

const GraphTimeRangeSelector = ({timeRanges, graphNDaysAgo, setGraphNDaysAgo}) => {

    let sameStartDate = (d1,d2) => {
        console.log(`comparing d1=${d1} == d2=${d2} `);
        console.log(`comparing d1=${d1.getTime()} == d2=${d2.getTime()} `);
        if (d1 && d2 && d1.getTime() == d2.getTime() ){
            return 'selected';
        }
        return '';
    }

    return (
        <div className="time-range-button-container">
            {   
                timeRanges.map((r,i) => (
                    <div
                        className={`time-range-button ${r.daysAgo == graphNDaysAgo ? 'selected':''}`}
                        onClick={() => setGraphNDaysAgo(r.daysAgo)}
                        key={i}>
                        <p className="time-range-button">{r.label}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default GraphTimeRangeSelector;