export function scoreMCHAT(answers, questions) {
  let riskScore = 0;

  answers.forEach((answer, index) => {
    if (answer === questions[index].riskAnswer) {
      riskScore += 1;
    }
  });

  let riskLevel = "Low";
  if (riskScore >= 8) riskLevel = "High";
  else if (riskScore >= 3) riskLevel = "Medium";

  return {
    score: riskScore,
    riskLevel,
  };
}
