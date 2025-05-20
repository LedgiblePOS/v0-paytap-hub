
import { useState, useCallback } from "react";
import { generateCSRFToken, validateCSRFToken } from "@/utils/security/csrf";

export const useCSRF = () => {
  const [csrfToken, setCSRFToken] = useState<string>(() => generateCSRFToken());

  const refreshToken = useCallback(() => {
    setCSRFToken(generateCSRFToken());
  }, []);

  return {
    csrfToken,
    refreshToken,
    validateToken: (token: string) => validateCSRFToken(token, csrfToken)
  };
};
