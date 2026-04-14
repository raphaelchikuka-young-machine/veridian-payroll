export const calculateZambianPayroll = (basicSalary: number) => {
  // 1. NAPSA: 5% of gross, capped at K1,861.80
  const napsa = Math.min(basicSalary * 0.05, 1861.80);

  // 2. NHIMA: 1% of basic
  const nhima = basicSalary * 0.01;

  // 3. PAYE (Tax) Calculation based on 2024/2025 Bands
  // Taxable income is usually Gross minus NAPSA
  const taxableIncome = basicSalary - napsa;
  let tax = 0;

  if (taxableIncome > 9200) {
    tax += (taxableIncome - 9200) * 0.37;
    tax += (9200 - 7100) * 0.30;
    tax += (7100 - 5100) * 0.20;
  } else if (taxableIncome > 7100) {
    tax += (taxableIncome - 7100) * 0.30;
    tax += (7100 - 5100) * 0.20;
  } else if (taxableIncome > 5100) {
    tax += (taxableIncome - 5100) * 0.20;
  }

  const netPay = basicSalary - napsa - nhima - tax;

  return {
    napsa,
    nhima,
    paye: tax,
    netPay: Math.max(0, netPay)
  };
};
