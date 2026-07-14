import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Mirrors the "Company Profile" link in Navbar/Footer: /company-profile (the
// URL baked into the printed QR code) resolves to the same VITE_COMPANY_PROFILE_URL
// external document. When that env var is unset, fall back to the homepage so the
// path never renders a 404. The env URL is external, so it needs a full-page
// navigation — <Navigate> only handles in-app routes.
const companyProfileUrl = import.meta.env.VITE_COMPANY_PROFILE_URL;

const CompanyProfileRedirect = () => {
  useEffect(() => {
    if (companyProfileUrl) {
      window.location.replace(companyProfileUrl);
    }
  }, []);

  if (companyProfileUrl) {
    return null;
  }

  return <Navigate to="/" replace />;
};

export default CompanyProfileRedirect;
