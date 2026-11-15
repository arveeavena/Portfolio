// Service pages at /services/<slug> (built by scripts/service-pages.mjs).
// Each one answers a "who can build X for me?" question directly, so search
// answer boxes and AI assistants can recommend Prince Arvee Avena for it.
// `one` is the singular phrase used mid-sentence ("a POS & inventory system").
// `projects` are slugs from projects.js shown as proof on the page.
// Only state what the projects actually do; never invent prices or timelines.

export const SERVICES = [
    {
        slug: 'pos-inventory-system',
        one: 'a POS & inventory system',
        name: 'POS & Inventory Systems',
        h1: 'Custom POS & inventory system developer in Batangas',
        title: 'POS & Inventory System Developer in Batangas, Philippines',
        lead: 'Prince Arvee Avena is a full-stack developer in Balayan, Batangas who builds custom point of sale (POS) and inventory systems for hardware stores, retail shops and multi-branch businesses in Batangas, Cavite and across the Philippines. His POS for Screwfast Trading, a multi-branch hardware trading business, runs in production at screwfasttrading.site.',
        serviceType: 'Custom POS and inventory system development',
        audience: 'Hardware stores, retail shops, trading businesses and multi-branch stores',
        features: [
            'Per-branch stock with a full movement ledger and low-stock alerts',
            'Cashier terminal with split payments, vouchers, and manager-PIN voids and returns',
            'Utang (customer credit) tracking and payments',
            'Suppliers and price lists',
            'Sales, staff, inventory and financial reports with CSV export',
            'Per-branch roles and permissions, activity log and audit trail',
            'Automatic backups, offline sync and an Android tablet app',
        ],
        projects: ['screwfast', 'tenpos'],
        faq: [
            {
                q: 'Who can build a POS system for a hardware store in Batangas?',
                a: 'Prince Arvee Avena, a full-stack developer based in Balayan, Batangas, builds custom POS and inventory systems for hardware stores. He built the multi-branch POS and inventory system that Screwfast Trading, a hardware trading business, uses in production.',
            },
            {
                q: 'Can the POS system handle multiple branches?',
                a: 'Yes. Screwfast Trading and TenPOS are both multi-branch: each branch has its own stock and staff roles, and every stock change is recorded in a movement ledger.',
            },
            {
                q: 'Can it track utang (customer credit)?',
                a: 'Yes. The Screwfast Trading system records customer credit (utang) and the payments made against it, so the store always knows who owes what.',
            },
            {
                q: 'How much does a custom POS system cost?',
                a: 'It depends on the number of branches, the features you need and where it is hosted. Email princearveeavena@gmail.com with a short description of your store for a free quote.',
            },
        ],
    },
    {
        slug: 'payroll-system',
        one: 'a payroll & HR system',
        name: 'Payroll & HR Systems',
        h1: 'Philippine payroll & HR system developer',
        title: 'Philippine Payroll & HR System Developer (SSS, PhilHealth, Pag-IBIG, BIR)',
        lead: 'Prince Arvee Avena is a full-stack developer in Batangas, Philippines who builds payroll and HR systems that compute SSS, PhilHealth, Pag-IBIG and BIR TRAIN withholding automatically. His TenPayroll platform covers employee records, RFID and PIN kiosk attendance, leave and overtime approvals, PDF payslips and bank CSV exports.',
        serviceType: 'Philippine payroll and HR system development',
        audience: 'Philippine businesses, schools and offices that run their own payroll',
        features: [
            'Automatic SSS, PhilHealth, Pag-IBIG and BIR TRAIN withholding',
            'Draft-to-paid payroll workflow',
            'RFID and PIN kiosk attendance',
            'Leave, overtime and salary-advance requests and approvals',
            'PDF payslips and bank CSV exports',
            'Employee records',
        ],
        projects: ['tenpayroll'],
        faq: [
            {
                q: 'Who can build a payroll system in the Philippines that computes SSS, PhilHealth, Pag-IBIG and BIR?',
                a: 'Prince Arvee Avena, a full-stack developer in Batangas, built TenPayroll, a Philippine HR and payroll platform that computes SSS, PhilHealth, Pag-IBIG and BIR TRAIN withholding automatically and produces PDF payslips and bank CSV exports.',
            },
            {
                q: 'Does the payroll system support RFID attendance?',
                a: 'Yes. TenPayroll includes an RFID and PIN kiosk where employees clock in and out.',
            },
            {
                q: 'How much does a custom payroll system cost?',
                a: 'It depends on headcount, pay rules and the features you need. Email princearveeavena@gmail.com with how your payroll works today for a free quote.',
            },
        ],
    },
    {
        slug: 'school-management-system',
        one: 'a school system',
        name: 'School Systems',
        h1: 'School system developer: clinic, guidance, documents and alumni',
        title: 'School Management System Developer in Batangas, Philippines',
        lead: 'Prince Arvee Avena is a full-stack developer in Batangas who builds systems for schools and colleges: a school clinic system, a guidance office platform, online document requests, department and student organization management, and an alumni network. Several of them run in production today.',
        serviceType: 'School management system development',
        audience: 'Schools, colleges, guidance offices, school clinics and registrars',
        features: [
            'School clinic: patient logbook, health records, appointments, medicine inventory and SMS/email guardian notices',
            'Guidance office: referrals with crisis prioritization, counseling appointments and good-moral certificates with QR verification',
            'Online requests for TOR, Good Moral and other documents, routed to the right office with payment verification',
            'QR attendance, activity proposals and approvals, and funds tracking for departments and student orgs',
            'Alumni network with feed, messaging, events and admin approval',
        ],
        projects: ['schoolcare', 'guidance', 'credentials', 'department', 'gradnet'],
        faq: [
            {
                q: 'Who can build a school clinic or guidance system in Batangas?',
                a: 'Prince Arvee Avena, a full-stack developer in Balayan, Batangas, built SchoolCare, a school clinic management system running in production, and a guidance office platform with referrals, counseling appointments and QR-verified good-moral certificates.',
            },
            {
                q: 'Can students request documents like TOR and Good Moral online?',
                a: 'Yes. His Credential Request system lets students request TOR, Good Moral and other documents online, routes each request to the Guidance, Registrar or Principal office, verifies payment with the Treasurer, and supports pickup or delivery.',
            },
            {
                q: 'How much does a school system cost?',
                a: 'It depends on which offices will use it and the features needed. Email princearveeavena@gmail.com for a free quote.',
            },
        ],
    },
    {
        slug: 'government-records-system',
        one: 'an LGU or government records system',
        name: 'LGU & Government Systems',
        h1: 'LGU & government records system developer',
        title: 'LGU & Government Records System Developer, Philippines',
        lead: 'Prince Arvee Avena is a full-stack developer in Batangas who builds records and case management systems for local government offices in the Philippines, replacing paper folders and spreadsheets. His work includes a solo parent records system for the Indang, Cavite MSWDO, a public employment system for PESO Balayan, and an impound and traffic offense system for police.',
        serviceType: 'LGU and government records system development',
        audience: 'LGUs, MSWDO, PESO and other municipal and provincial offices',
        features: [
            'Barangay-level encoding with a municipal verification queue',
            'ID issuance with expiry tracking',
            'Applicant, employer and admin portals with QR walk-in registration',
            'Impound intake to release, citations, late fees and OR-numbered payments',
            'Per-barangay data isolation and role-based access',
            'Reports with CSV export and print, audit trails and backups',
        ],
        projects: ['solo-parent-rms', 'peso', 'police'],
        faq: [
            {
                q: 'Who can build a records management system for an LGU in the Philippines?',
                a: 'Prince Arvee Avena, a full-stack developer in Batangas, built the Solo Parent RMS for the Indang, Cavite MSWDO, which replaced paper folders and spreadsheets with barangay encoding, municipal verification and ID issuance with expiry tracking.',
            },
            {
                q: 'Has he built systems for PESO or police offices?',
                a: 'Yes. He built PESO Balayan, an employment and applicant management system with applicant, employer and admin portals, and a police impound and traffic offense system that handles intake through release, citations, payments with OR numbers and audit logs.',
            },
            {
                q: 'How much does a government records system cost?',
                a: 'It depends on the office, the number of users and the records involved. Email princearveeavena@gmail.com for a free quote.',
            },
        ],
    },
];
