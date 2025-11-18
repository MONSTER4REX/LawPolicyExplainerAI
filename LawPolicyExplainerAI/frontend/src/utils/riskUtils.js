/**
 * Utility function to calculate risk level based on risk analysis text
 * @param {string} risks - The risk analysis text (each line is a risk item)
 * @returns {string} - Risk level: 'none', 'low', 'medium', or 'high'
 */
export const getRiskLevel = (risks) => {
  if (!risks || risks.trim() === '') return 'none';
  
  // Count the number of risk items (each line is a risk)
  const riskCount = risks.split('\n').filter(line => line.trim()).length;
  
  // Risk level classification based on count
  if (riskCount >= 5) return 'high';
  if (riskCount >= 3) return 'medium';
  return 'low';
};

/**
 * Get risk level label for display
 * @param {string} riskLevel - The risk level ('none', 'low', 'medium', 'high')
 * @returns {string} - Human-readable risk level label
 */
export const getRiskLevelLabel = (riskLevel) => {
  switch (riskLevel) {
    case 'none':
      return 'No Risks';
    case 'low':
      return 'Low Risk';
    case 'medium':
      return 'Medium Risk';
    case 'high':
      return 'High Risk';
    default:
      return 'Unknown Risk';
  }
};


