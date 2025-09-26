# Interview Task: Address App

## Goal
Build a small application with a .NET backend and any frontend of your choice.

## Requirements

### Backend
- Create a REST API for managing **Addresses**:
  - List all addresses
  - Add new
  - Edit existing
  - Delete
- Support **bulk import** from text posts like:
> Запорізька обл., Запоріжжя, Відділення №16 (до 30 кг на одне місце): просп. Леніна, 84, +380974805040, пн-ср 08:00-15:00, сб-нд 10:00-12:00
- Parse and save into structured fields: region, city, branch number, address, phone, working hours.
- Sample input data is available in [`addresses.json`](./addresses.json)

### Frontend
- Display list of addresses.
- Allow add, edit, delete.
- You may use Angular, React, Vue, Next.js, etc.
- A mockup of the expected UI is available in [`ui.jpg`](./ui.jpg). Left part desktop, right part - mobile.

## Bonus
- Deploy backend (Azure, Render, etc.) and frontend (Vercel/Netlify/Github etc) or any service of your choice.
- Add unit tests.
- Add search/filter on frontend.

## Delivery
When you are done, please provide:
1. **GitHub Repository Link** – containing your source code.  
   - The repo should include clear instructions in the README on how to run the project if there is no deployment.
2. **Deployed Application Link** (if available)

