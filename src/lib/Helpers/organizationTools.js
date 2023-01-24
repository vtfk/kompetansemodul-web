export const structurizeOrg = (units) => {
    for (const unit of units) {
        unit.underordnet = unit.underordnet.map(child => {
            if (!units.find((u => u.organisasjonsId === child.organisasjonsId))) return null // These are unit with gyldighetsperiode slutt
            return units.find(u => u.organisasjonsId === child.organisasjonsId)
        }).filter(u => u !== null) // Filter out units with gyldighetsperiode slutt
    }
    return [units.find(unit => unit.organisasjonsId === 'hoved')]
}