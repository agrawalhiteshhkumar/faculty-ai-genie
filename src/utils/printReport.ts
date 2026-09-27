export interface ReportSummaryMetric {
  label: string;
  value: string;
}

export interface OfficialReportOptions {
  title: string;
  subtitle: string;
  regulatoryBody: "PCI" | "MSBTE" | "DTE" | "MAHA_FFC" | "MAHADBT" | "GOVERNANCE";
  reportRefNo: string;
  dataHeaders: string[];
  dataRows: (string | number)[][];
  summaryMetrics?: ReportSummaryMetric[];
  auditHash: string;
}

export function generateOfficialReport(options: OfficialReportOptions) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate and print statutory reports.");
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${options.title} - DPKCOP</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      height: 48px;
      width: 48px;
      object-fit: contain;
    }
    .college-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: -0.2px;
    }
    .college-sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 1px;
    }
    .statutory-badges {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }
    .badge {
      font-size: 8.5px;
      font-family: monospace;
      font-weight: bold;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .report-meta {
      text-align: right;
      font-size: 9px;
      color: #64748b;
    }
    .report-title-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      padding: 8px 12px;
      margin-bottom: 14px;
      border-radius: 4px;
    }
    .report-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }
    .report-subtitle {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 1px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-bottom: 14px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 4px;
    }
    .metric-label {
      font-size: 8.5px;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
    }
    .metric-val {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 10px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.5px;
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    td {
      border: 1px solid #e2e8f0;
      padding: 5px 8px;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    .signatory-box {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px dashed #cbd5e1;
      padding-top: 14px;
    }
    .seal-block {
      font-size: 9px;
      color: #64748b;
    }
    .seal-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 10.5px;
    }
    .seal-sub {
      font-size: 9px;
      color: #475569;
    }
    .verified-stamp {
      border: 1.5px solid #16a34a;
      color: #16a34a;
      padding: 3px 8px;
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 4px;
    }
    .footer-audit {
      margin-top: 16px;
      font-size: 8px;
      color: #94a3b8;
      font-family: monospace;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #f1f5f9;
      padding-top: 6px;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="brand-left">
      <img src="https://raw.githubusercontent.com/agrawalhiteshhkumar/faculty-ai-genie/main/brightpath-logo.png" class="brand-logo" alt="BrightPath Logo" />
      <div>
        <div class="college-name">D. P. Kharde Navjeevan College of Pharmacy</div>
        <div class="college-sub">Navjeevan Education Society • Sinnar, Nashik, Maharashtra – 422103</div>
        <div class="statutory-badges">
          <span class="badge">MSBTE: 62386</span>
          <span class="badge">DTE: 5539</span>
          <span class="badge">PCI: 9178</span>
          <span class="badge">AISHE: S-22693</span>
        </div>
      </div>
    </div>
    <div class="report-meta">
      <div><strong>Ref No:</strong> ${options.reportRefNo}</div>
      <div><strong>Issue Date:</strong> ${currentDate}</div>
      <div><strong>Statutory Body:</strong> ${options.regulatoryBody}</div>
    </div>
  </div>

  <div class="report-title-banner">
    <div class="report-title">${options.title}</div>
    <div class="report-subtitle">${options.subtitle}</div>
  </div>

  ${
    options.summaryMetrics && options.summaryMetrics.length > 0
      ? `
    <div class="metrics-grid">
      ${options.summaryMetrics
        .map(
          (m) => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-val">${m.value}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `
      : ""
  }

  <table>
    <thead>
      <tr>
        ${options.dataHeaders.map((h) => `<th>${h}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${options.dataRows
        .map(
          (row) => `
        <tr>
          ${row.map((cell) => `<td>${cell}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="signatory-box">
    <div class="seal-block">
      <div class="seal-title">Official Institutional Register</div>
      <div>Office of Academic Affairs & Statutory Compliance</div>
      <div class="verified-stamp">Digitally Certified & Formatted</div>
    </div>
    <div style="text-align: right;">
      <div class="seal-title">Dr. Hiteshkumar Agrawal</div>
      <div class="seal-sub">Principal & Chief Academic Architect</div>
      <div class="seal-sub">Ph.D, M.Pharm • Navjeevan College of Pharmacy</div>
      <div class="seal-sub" style="font-size: 8px; color: #94a3b8; margin-top: 3px;">Executive Authority Signatory Seal</div>
    </div>
  </div>

  <div class="footer-audit">
    <span>BrightPath Office AI Genie™ • Statutory Platform v2026.4</span>
    <span>Cryptographic Ledger Hash: ${options.auditHash}</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
