import api from "./api";

export const loansService = {
  getMyLoans: () => api.get("/loans/mine"),
  borrow: (bookId: string) => api.post("/loans", { bookId }),
  return: (loanId: string) => api.post(`/loans/${loanId}/return`, {}),
  renew: (loanId: string) => api.post(`/loans/${loanId}/renew`, {}),
};
