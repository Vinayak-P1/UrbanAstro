export function generateReportText({ name, birthDate, birthTime, birthLocation, selectedLifeAreas, question }) {
const focus = (selectedLifeAreas || []).join(', ') || 'General';
const sections = [
`Querent: ${name || 'User'}`,
`Birth: ${birthDate || 'NA'} ${birthTime || ''} at ${birthLocation || 'NA'}`,
`Focus: ${focus}`,
question ? `Question: ${question}` : null,
'',
'Insights:',
`• You are in a consolidation phase. Keep a tight weekly cadence and ship something visible each week.`,
`• Decisions: run small, reversible experiments for two weeks before committing big.`,
`• Career tip: publish one portfolio artifact per week (project/writeup/optimization).`,
'',
'Next 30 days:',
'• W1: Audit habits & sleep.\n• W2: 10 targeted applications.\n• W3: Mock interviews.\n• W4: Ship a demo.'
].filter(Boolean);
return sections.join('\n');
}