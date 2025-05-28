## 1. `src/app/page.tsx` (Landing Page)
- Polish hero, partners, snapshot, and CTA sections.
- Ensure all links work.
- Test responsiveness on all devices.
- Add meta tags, title, and description for SEO.
- Add alt text for images, ensure keyboard navigation.
- Proofread all text.

---

## 2. `src/app/dashboard/claim/page.tsx` (Claim Page)
- Ensure all supported wallets work.
- **Social Verification:** Implement real Twitter/X and Telegram OAuth (call backend endpoints).
- **Claim Logic:** Connect claim button to real backend/contract API (call endpoint, handle response).
- Ensure multipliers reflect real user data (fetch from backend if needed).
- Show real token balances, handle errors.
- Show user-friendly loading/error states.
- Test accessibility and responsiveness.

---

## 3. `src/app/dashboard/page.tsx` (Dashboard Home)
- Ensure wallet connect/disconnect works.
- Fetch and display real token balances (call backend if needed).
- **AI Chat Integration:**  
  - Call the AI backend API for chat responses (handle loading, errors, and display).
  - Polish chat UI (typing indicator, avatars, timestamps).
- Ensure quick topic buttons trigger correct API calls.
- Credentials/progress: fetch from backend if dynamic.
- Test accessibility and responsiveness.

---

## 4. `src/app/dashboard/portfolio/page.tsx` (Portfolio)
- Add, remove, and select wallets.
- Fetch and display real balances, prices, allocations (call backend or public APIs).
- Use a real charting library if possible.
- **AI Portfolio Optimization:**  
  - Call backend/AI API for portfolio optimization suggestions.
  - Display AI recommendations and allow user to apply them (if supported).
- For actions (swap, export): Call backend APIs or show “Coming Soon.”
- Ensure all dialogs open/close and validate input.
- Test accessibility and responsiveness.

---

## 5. `src/app/dashboard/academy/page.tsx` (Academy)
- Polish course UI (real or mock data).
- Save/load progress (localStorage or backend).
- Validate quiz answers, show results.
- For certificates: Call backend/on-chain API or show “Coming Soon.”
- **(Optional) AI-Powered Learning:**  
  - If provided, hook up to AI for personalized learning paths or quiz feedback.
- Test accessibility and responsiveness.

---

## 6. `src/app/dashboard/analytics/page.tsx` (Analytics)
- Fetch and display real analytics, price, and whale data (call backend or public APIs).
- Ensure all tabs work and data loads.
- Charts/tables: data is accurate and readable.
- Show user-friendly error/loading states.
- Test accessibility and responsiveness.

---

## 7. `src/app/dashboard/bridge/page.tsx` (Bridge)
- If not ready, show “Coming Soon.”
- Ensure wallet connect works.
- Test accessibility and responsiveness.

---

## 8. `src/app/dashboard/community/page.tsx` (Community)
- Implement real Twitter OAuth (call backend for login if provided).
- Polish community data UI (discussions, events, contributors).
- Posting: Call backend API or disable if not implemented.
- Ensure all tabs work and data loads.
- Test accessibility and responsiveness.

---

## 9. `src/app/dashboard/insights/page.tsx` (AI Insights)
- **AI Insights Integration:**  
  - Call AI backend API for insights, predictions, and strategies.
  - Show loading, error, and empty states.
  - Display AI-generated content in all tabs and modals.
- Ensure all tabs work and data loads.
- Trend modals: open/close, show correct info from backend.
- Test accessibility and responsiveness.

---

## 10. `src/app/dashboard/yield/page.tsx` (Yield Optimizer)
- Polish UI (real or mock data).
- **AI Yield Suggestions:**  
  - If provided, call backend/AI API for yield optimization or strategy suggestions.
- For actions: Call backend API or disable if not implemented.
- Test accessibility and responsiveness.

---

## 11. `src/app/dashboard/vote/page.tsx` (Governance/Voting)
- Load and display proposals (call backend if dynamic).
- Voting: Call backend API or disable if not implemented.
- Ensure dialogs open/close and validate input.
- Test accessibility and responsiveness.

---

## 12. `src/app/tokenomics/page.tsx` (Tokenomics)
- Ensure charts/stats use real or mock data.
- Polish UI/UX, test on all devices.
- Add alt text, ensure keyboard navigation.

---

## 13. `src/app/preview/page.tsx` (Preview)
- Ensure all sections are correct.
- Polish UI/UX, test on all devices.

---

## 14. `src/app/head.tsx` (Head)
- Set correct title, meta tags, favicon, etc.

---

## 15. `src/app/layout.tsx` (Root Layout)
- Ensure global styles are consistent.
- All context/providers are set up correctly.

---

## 16. `src/components/DashboardLayout.tsx` (Sidebar/Layout)
- Sidebar: Collapsible, hamburger always visible, navigation works.
- Notifications: Modal works, badge updates.
- Wallet button: Always accessible.
- Test accessibility and responsiveness.

---

## 17. `src/components/ErrorBoundary.tsx`
- Ensure errors are caught and displayed gracefully.

---

## 18. `src/components/NotificationsModal.tsx`
- Notifications: Loads, marks as read, styles are correct.

---

## 19. `src/app/api/socket/route.ts`
- API: Returns correct response for unsupported socket.io.

---

## 20. **Other Checks**
- 404/500 Pages: Custom error pages.
- Loading indicators: Everywhere async data is loaded.
- Theme consistency: Colors, fonts, spacing.
- Environment variables: No secrets in frontend.
- Testing: Manual and automated.
- Documentation: README, setup, usage.

---

### **Summary of AI Integration Points (Frontend)**
- **Dashboard Home:** Hook up chat to AI backend.
- **Portfolio:** Hook up portfolio optimization to AI backend.
- **Insights:** Hook up all insights, predictions, and strategies to AI backend.
- **Yield (if applicable):** Hook up yield suggestions to AI backend.
- **Academy (optional):** Hook up AI-powered learning if provided.

**For each, your job is to:**
- Call the backend/AI API.
- Handle loading, error, and empty states.
- Display the AI’s response in the UI.
- Never expose API keys or secrets in the frontend.
