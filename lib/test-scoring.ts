export function responseToAgreementScore(response: number): number {
  return Math.max(1, Math.min(5, 6 - response));
}

export function calculateQuestionScore(response: number, reverseScored = false): number {
  const agreementScore = responseToAgreementScore(response);
  return reverseScored ? 6 - agreementScore : agreementScore;
}
