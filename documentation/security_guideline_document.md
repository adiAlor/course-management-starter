# Security Guidelines for Adapting the `course-management-starter` Frontend

This document provides a comprehensive set of security best practices to follow when repurposing the [course-management-starter](https://github.com/) Next.js template as a standalone frontend connecting to an Express.js + MySQL backend. These guidelines span design, authentication, input handling, data protection, API hardening, and deployment.

---

## 1. Secure Architecture & Design Principles

- **Security by Design**: Integrate security considerations early in the UI–API contract, component boundaries, and deployment pipeline.  
- **Least Privilege**: Grant the frontend only the minimal HTTP endpoints and permissions it needs on the backend.  
- **Defense in Depth**: Layer controls at network, transport, application, and client levels.
- **Fail Securely**: On any API or network error, do not leak stack traces or sensitive data to end users. Display a generic fallback UI.
- **Secure Defaults**: Default to HTTPS, `HttpOnly` cookies, strict CORS, and CSP in all environments.

---

## 2. Authentication & Access Control

1. **JWT-Based Auth Flow**  
   - Use secure, signed JWTs with a robust secret or asymmetric key pair.  
   - Reject tokens signed with `alg: none` or weak algorithms.  
   - Validate `exp`, `iat`, `nbf`, and issuer/audience claims on every request.  
2. **Secure Token Storage**  
   - Store tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies to mitigate XSS.  
   - Avoid `localStorage`/`sessionStorage` for sensitive tokens.  
3. **Role-Based UI Rendering**  
   - In `app/dashboard/layout.tsx`, fetch user role via a protected API call.  
   - Drive navigation and component visibility purely from server-verified roles.  
4. **Session Management**  
   - Enforce idle and absolute session timeouts on the backend.  
   - Provide a `/logout` endpoint that clears server-side sessions or revokes tokens.  
5. **Multi-Factor Authentication (MFA)** (Optional for elevated roles)  
   - Offer TOTP or SMS OTP flows for admin or leadership users.  
6. **Brute-Force & Enumeration**  
   - Implement rate limiting on login and sign-up endpoints (e.g., 5 attempts/hour).  
   - Genericize error messages to avoid username enumeration.

---

## 3. Input Validation & Output Encoding

- **Client-Side Form Validation**  
  - Use schema-driven validation (e.g., Zod, Yup) to enforce field formats before submission.  
- **Server-Side Validation**  
  - Do not trust client validation. Re-validate all inputs on the Express.js side.  
- **Prevent Injection**  
  - Use parameterized queries or ORM methods (e.g., Sequelize/Prisma) in Express.  
- **Output Encoding**  
  - Escape all user-provided text rendered in React components to prevent XSS.  
  - Avoid dangerously setting `innerHTML`. If rendering HTML is required, sanitize it thoroughly.  
- **File Uploads (if used)**  
  - Restrict allowed MIME types and file extensions.  
  - Scan uploads for malware.  
  - Store uploads outside the public folder or behind a download endpoint with access checks.

---

## 4. Data Protection & Secrets Management

- **Encrypt In Transit**  
  - Enforce HTTPS/TLS 1.2+ for all front-end <–> API traffic.  
  - Redirect HTTP to HTTPS automatically (HSTS with `max-age` and include subdomains).  
- **Secrets Handling**  
  - Do not hardcode any API keys, DB credentials, or private keys in the frontend repo.  
  - Use environment variables (`NEXT_PUBLIC_API_URL` for public-safe values).  
  - Store private secrets (JWT signing key) exclusively on the backend.  
- **Sensitive Data Exposure**  
  - Mask or omit PII in client logs and error messages.  
  - Use hashed or truncated IDs in client-visible URLs where possible.

---

## 5. API & Service Security

- **Strict CORS Configuration**  
  - Allow only the frontend’s origin (or subdomains) in `Access-Control-Allow-Origin`.  
  - Use `Access-Control-Allow-Credentials: true` with care, only if using cookies for auth.  
- **Rate Limiting & Throttling**  
  - Apply per-IP or per-user rate limiting on critical endpoints (login, CRUD operations).  
- **Endpoint Authorization**  
  - Validate JWT and roles server-side for each protected route.  
  - Deny all by default; grant access selectively.  
- **API Versioning**  
  - Prefix routes with `/v1/`, `/v2/` to allow secure deprecation of old endpoints.

---

## 6. Web Application Security Hygiene

1. **Content Security Policy (CSP)**  
   - Define a strict CSP header that restricts allowed script, style, and image sources.  
   - Disallow `unsafe-inline` and `eval()`.  
2. **Security Headers**  
   - `Strict-Transport-Security`: Enforce HTTPS.  
   - `X-Content-Type-Options: nosniff`: Prevent MIME sniffing.  
   - `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`: Block clickjacking.  
   - `Referrer-Policy: no-referrer-when-downgrade` (or stricter).  
3. **CSRF Protection**  
   - If using cookies for session auth, implement anti-CSRF tokens on state-changing requests.  
   - For JWT Authorization headers, CSRF risk is lower, but still validate origin headers.  
4. **Subresource Integrity (SRI)**  
   - For any third-party scripts/styles (CDNs), include SRI hashes.

---

## 7. Infrastructure & Deployment Security

- **Docker Hardening**  
  - Build frontend images with minimal base images (e.g., `node:alpine`).  
  - Drop unnecessary Linux capabilities.  
  - Run the container as a non-root user.  
- **Secure Configuration**  
  - Remove development‐only variables and flags in production.  
  - Disable Next.js debug/error overlay in production mode.  
- **Network Controls**  
  - Expose only the frontend port (e.g., 3000) to the public.  
  - Place the backend and database in a private network segment.  
- **TLS Certificates**  
  - Automate certificate issuance and renewal (e.g., Let’s Encrypt).  
  - Use strong cipher suites; disable TLS 1.0/1.1.

---

## 8. Dependency & Build Management

- **Secure Dependencies**  
  - Vet all `npm` packages for active maintenance and security advisories.  
  - Use a Software Composition Analysis (SCA) tool (e.g., npm audit, Snyk).  
- **Lockfiles & Pinning**  
  - Commit `package-lock.json` to ensure deterministic builds.  
  - Pin critical direct dependencies to specific versions.  
- **Minimal Footprint**  
  - Remove unused packages and large utility libraries not in use.  
  - Regularly update to patched versions.

---

## 9. Recommendations & Next Steps

1. **Threat Modeling Workshop**  
   - Involve stakeholders to identify use-case threats and map trust boundaries.  
2. **Penetration Testing**  
   - Schedule periodic pentests focusing on XSS, CSRF, JWT misuse, and misconfigurations.  
3. **Continuous Security Scanning**  
   - Integrate SCA and static analysis (e.g., ESLint Security) into CI/CD.  
4. **Logging & Monitoring**  
   - Centralize client and server logs.  
   - Monitor for suspicious login patterns, token errors, or CSP violations.  
5. **Security Training**  
   - Ensure developers understand OWASP Top 10 and secure coding practices.

By following these guidelines, you will significantly strengthen the security posture of your frontend adaptation, protect your users’ data, and maintain a resilient, maintainable Course Management System.
