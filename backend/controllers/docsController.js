const renderDocs = (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QAEMS API Documentation - Glory Simon Interiors</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #0b0f19;
      --panel-bg: rgba(17, 24, 39, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --brand-gold: #d97706;
      --brand-blue: #3b82f6;
      --brand-emerald: #10b981;
      --brand-rose: #f43f5e;
      --font-display: 'Outfit', sans-serif;
      --font-body: 'Plus Jakarta Sans', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.6;
      padding: 2rem;
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(217, 119, 6, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 2rem;
      margin-bottom: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h1 {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      background: linear-gradient(to right, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .badge {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .grid {
      display: grid;
      grid-template-cols: 100%;
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      .grid {
        grid-template-cols: 300px 1fr;
      }
    }

    nav {
      position: sticky;
      top: 2rem;
      align-self: start;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: var(--panel-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 1.25rem;
    }

    nav h3 {
      font-family: var(--font-display);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--brand-gold);
      margin-bottom: 0.75rem;
    }

    nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    nav a:hover, nav a.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    main {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .card {
      background: var(--panel-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .endpoint {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .method {
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.3rem 0.8rem;
      border-radius: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .method.post { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; }
    .method.get { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; }
    .method.put { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; }
    .method.delete { background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); color: #f87171; }

    .path {
      font-family: monospace;
      font-size: 0.95rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--brand-gold);
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }

    th, td {
      text-align: left;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
    }

    td.param-name {
      font-family: monospace;
      font-weight: 600;
      color: #38bdf8;
    }

    td.param-req {
      color: var(--brand-rose);
      font-weight: 600;
    }

    pre {
      background: #060913;
      border: 1px solid rgba(255, 255, 255, 0.04);
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      font-family: monospace;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    code {
      color: #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>QAEMS v1 REST API</h1>
        <div class="subtitle">Interactive reference manual for developers of Glory Simon Interiors</div>
      </div>
      <div class="badge">API Base: /api/v1</div>
    </header>

    <div class="grid">
      <nav>
        <h3>Modules</h3>
        <a href="#auth">Authentication</a>
        <a href="#clients">Client Management</a>
        <a href="#visits">Site Visits</a>
        <a href="#quotations">Quotations Engine</a>
        <a href="#dashboard">Dashboard Analytics</a>
        <a href="#reports">Reports & Pipeline</a>
        <a href="#notifications">Notifications</a>
      </nav>

      <main>
        <!-- Authentication Card -->
        <section id="auth" class="card">
          <div class="card-title">Authentication</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/auth/login</span>
            </div>
            <div class="desc">Authenticates user credentials and returns a secure token along with user metadata.</div>
            <div class="section-title">Sample Response</div>
            <pre><code>{
  "success": true,
  "message": "Success",
  "data": {
    "token": "mock-token-uid-admin",
    "user": {
      "id": "UID-ADMIN",
      "email": "admin@glorysimon.com",
      "name": "Admin User",
      "role": "Admin",
      "createdAt": "2026-06-19T10:00:00.000Z"
    }
  }
}</code></pre>
          </div>

          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/auth/register</span>
            </div>
            <div class="desc">Registers a new developer user profile.</div>
          </div>
        </section>

        <!-- Clients Card -->
        <section id="clients" class="card">
          <div class="card-title">Client Management</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method get">GET</span>
              <span class="path">/clients</span>
            </div>
            <div class="desc">Retrieves all CRM clients from Firestore. Returns success object.</div>
            <div class="section-title">Sample Response</div>
            <pre><code>{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "CLI-001",
      "name": "David Harrison",
      "email": "david.h@example.com",
      "phone": "555-0199",
      "address": "742 Evergreen Terrace",
      "projectType": "Residential",
      "status": "Proposal",
      "createdAt": "2026-05-15T12:00:00.000Z"
    }
  ]
}</code></pre>
          </div>

          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/clients</span>
            </div>
            <div class="desc">Registers a new client and triggers a "Client Created" audit activity log.</div>
            <div class="section-title">Validation Fields</div>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Rules</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="param-name">name</td>
                  <td>String</td>
                  <td class="param-req">Yes</td>
                  <td>Full Name</td>
                </tr>
                <tr>
                  <td class="param-name">email</td>
                  <td>String</td>
                  <td class="param-req">Yes</td>
                  <td>Valid email format</td>
                </tr>
                <tr>
                  <td class="param-name">phone</td>
                  <td>String</td>
                  <td class="param-req">Yes</td>
                  <td>Standard dial format</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Visits Card -->
        <section id="visits" class="card">
          <div class="card-title">Site Visits</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/site-visits</span>
            </div>
            <div class="desc">Schedules a new visit, notifies team, and logs activity to the feed.</div>
            <div class="section-title">Sample Payload</div>
            <pre><code>{
  "clientId": "CLI-001",
  "visitDate": "2026-06-21T10:30:00.000Z",
  "address": "742 Evergreen Terrace, Brooklyn",
  "assignedDesigner": "Sarah Jenkins",
  "notes": "Bring material boards"
}</code></pre>
          </div>
        </section>

        <!-- Quotation Builder Card -->
        <section id="quotations" class="card">
          <div class="card-title">Quotation Engine</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/quotations/calculate</span>
            </div>
            <div class="desc">Calculates quotation estimates in real-time without committing files to the database.</div>
            <div class="section-title">Sample Request</div>
            <pre><code>{
  "roomType": "Living Room",
  "area": 250,
  "materialLevel": "Premium",
  "furnitureItems": ["Sofa", "TV Unit"],
  "lightingType": "Smart Lighting",
  "labourCost": 15000,
  "tax": 18,
  "discount": 5
}</code></pre>
            <div class="section-title">Sample Response</div>
            <pre><code>{
  "success": true,
  "message": "Calculation completed",
  "data": {
    "materialCost": 45000,
    "furnitureCost": 43000,
    "lightingCost": 25000,
    "labourCost": 15000,
    "subtotal": 128000,
    "taxAmount": 23040,
    "discountAmount": 6400,
    "grandTotal": 144640
  }
}</code></pre>
          </div>

          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method post">POST</span>
              <span class="path">/quotations</span>
            </div>
            <div class="desc">Calculates and commits the quotation record to Firestore. Initializes status history.</div>
          </div>
        </section>

        <!-- Dashboard Card -->
        <section id="dashboard" class="card">
          <div class="card-title">Dashboard Analytics</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method get">GET</span>
              <span class="path">/dashboard/summary</span>
            </div>
            <div class="desc">Aggregates dynamic collection indicators. Returns clients totals, approved quotients count, pending statuses count, and sum of revenue.</div>
            <div class="section-title">Sample Response</div>
            <pre><code>{
  "success": true,
  "message": "Success",
  "data": {
    "totalClients": 5,
    "totalQuotations": 2,
    "approvedQuotations": 1,
    "pendingQuotations": 1,
    "revenueGenerated": 126560
  }
}</code></pre>
          </div>
        </section>

        <!-- Reports Card -->
        <section id="reports" class="card">
          <div class="card-title">Reports & Pipeline</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method get">GET</span>
              <span class="path">/reports/revenue</span>
            </div>
            <div class="desc">Fetches dynamic revenue pipeline data of past 6 months structured for RechartsArea chart nodes.</div>
          </div>
        </section>

        <!-- Notifications Card -->
        <section id="notifications" class="card">
          <div class="card-title">Notifications</div>
          
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method get">GET</span>
              <span class="path">/notifications</span>
            </div>
            <div class="desc">Gets full list of broadcast alert logs.</div>
          </div>
        </section>
      </main>
    </div>
  </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
};

module.exports = {
  renderDocs
};
