export function getLabel (total, percentage, county, countyStats) {
    // Includes percentage value in the label only if its less or eqal to the given percentage value passed into the function from the component. 
    return (((countyStats / total ) * 100) >= percentage ? `${county} (${countyStats})` : `${county} (${countyStats},  ${((countyStats/ total ) * 100) ===  Infinity ? '0%': Number.isNaN((countyStats / total ) * 100) ? 0 : ((countyStats / total ) * 100)}%)`)
    // return (((countyStats / total ) * 100) < percentage ? `${county} (${countyStats}, ${((countyStats/ total ) * 100).toFixed(1)}%)` : `${county} (${countyStats},  ${((countyStats/ total ) * 100) ===  Infinity ? '0%': ((countyStats / total ) * 100).toFixed(1) }%)`)
}