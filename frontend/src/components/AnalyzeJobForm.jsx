import React, { useState } from 'react';
import { Search, Sparkles, Building2, MapPin, DollarSign, Mail, Link, Briefcase, FileText, Loader2, Zap, ShieldCheck } from 'lucide-react';

const DEMO_PRESETS = [
  {
    name: '🟢 Legitimate Senior Tech Role (Low Risk)',
    riskLevel: 'low',
    data: {
      job_title: 'Senior Cloud Architect',
      company_name: 'Stripe Inc.',
      location: 'San Francisco, CA (Hybrid)',
      employment_type: 'Full-time',
      salary_range: '$180,000 - $220,000 / year',
      contact_email: 'careers@stripe.com',
      application_url: 'https://stripe.com/jobs/build-cloud-infrastructure',
      job_description: `We are looking for a Senior Cloud Architect to join our Core Infrastructure engineering team. 

Key Responsibilities:
- Design, build, and maintain highly scalable multi-region AWS and GCP cloud infrastructure using Terraform and Kubernetes.
- Drive high availability (99.999% uptime) across global financial transaction pipelines.
- Partner with security compliance engineers to enforce SOC2, ISO27001, and HIPAA protocols.
- Mentor junior engineers and participate in code reviews.

Qualifications:
- 6+ years of professional experience in cloud system engineering.
- Deep expertise with Kubernetes, Go, Python, and infrastructure-as-code.
- Bachelor's degree in Computer Science or equivalent practical experience.

Benefits:
- Competitive base salary with annual equity grant.
- Full medical, dental, and vision insurance with 100% premium coverage.
- 401(k) retirement plan with 5% employer matching.
- Unlimited PTO and wellness stipends.
Equal Opportunity Employer.`
    }
  },
  {
    name: '🟡 Generic Marketing Contract (Moderate Risk)',
    riskLevel: 'moderate',
    data: {
      job_title: 'Remote Digital Content Specialist',
      company_name: 'Apex Growth Marketing',
      location: 'Remote',
      employment_type: 'Contract',
      salary_range: '$40 - $55 / hour',
      contact_email: 'apexmarketing_hr@gmail.com',
      application_url: '',
      job_description: `Urgent opening for a Remote Digital Content Specialist!

We need a motivated individual to produce daily social media posts, blog articles, and email copy for our growing client base. Flexible working hours—work when you want!

Requirements:
- Good writing skills in English.
- Ability to meet fast deadlines.
- Must have personal laptop and reliable Wi-Fi.

To apply, send your resume directly to our hiring manager via email at apexmarketing_hr@gmail.com or reply to this posting.`
    }
  },
  {
    name: '🟧 Telegram Interview Data Entry (High Risk)',
    riskLevel: 'high',
    data: {
      job_title: 'Virtual Administrative Assistant',
      company_name: 'Stealth Logistics Startup',
      location: 'Work From Home',
      employment_type: 'Full-time',
      salary_range: '$45 per hour ($3,600 / week)',
      contact_email: 'recruiter.stealth@yahoo.com',
      application_url: '',
      job_description: `URGENT WORK FROM HOME OPPORTUNITY! EARN $45/HR NO EXPERIENCE REQUIRED!

We are expanding our operations and hiring 15 Virtual Data Entry Assistants immediately. 

Duties:
- Type customer orders into spreadsheet databases.
- Manage schedule calendar and reply to emails.

Offer Terms:
- Pay: $45.00/hr ($1,800 paid weekly via direct deposit or check).
- Work 15-20 hours a week from home.
- Flexible schedule.

HOW TO APPLY:
Contact our Hiring Manager Mr. David Miller directly on Telegram messenger (@DavidMillerHR_Jobs) or WhatsApp to conduct an online text interview. Act fast before spots fill up!`
    }
  },
  {
    name: '🔴 Check Cashing & Wire Scam (Obvious Fraud)',
    riskLevel: 'very_high',
    data: {
      job_title: 'Financial Transaction & Reshipping Coordinator',
      company_name: 'Confidential Global Trade Ltd',
      location: '100% Remote',
      employment_type: 'Part-time',
      salary_range: '$5,000 / month guaranteed',
      contact_email: 'hr-support@tempmail.com',
      application_url: 'http://192.168.1.105/job-portal',
      job_description: `IMMEDIATE START! EARN $5,000 A MONTH WORKING 1 HOUR A DAY FROM HOME!

We are seeking a reliable Financial Coordinator to assist with domestic funds distribution and equipment purchasing.

Job Duties:
1. Receive cashier checks sent to your home address by corporate clients.
2. Deposit checks into your personal bank account.
3. Keep 10% commission ($500 per check).
4. Transfer the remaining balance via Western Union, Wire Transfer, or Bitcoin to our suppliers.
5. Purchase Apple gift cards or home office equipment for training.

Requirements:
- Active checking account.
- Must provide Social Security Number (SSN), copy of Driver License, and online bank account details upfront for identity verification before starting work.
- Must purchase $150 software starter kit gift card prior to training.

Apply immediately by sending your SSN and bank info to hr-support@tempmail.com.`
    }
  }
];

export default function AnalyzeJobForm({ onAnalyze, isLoading }) {
  const [formData, setFormData] = useState({
    job_description: '',
    job_title: '',
    company_name: '',
    location: '',
    employment_type: 'Full-time',
    salary_range: '',
    contact_email: '',
    application_url: ''
  });

  const loadPreset = (preset) => {
    setFormData(preset.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.job_description.trim()) return;
    onAnalyze(formData);
  };

  const wordCount = formData.job_description.trim() ? formData.job_description.trim().split(/\s+/).length : 0;
  const charCount = formData.job_description.length;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      
      {/* Page Title & Subtitle */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">Job Posting Safety Checking Editor</h1>
          <p className="text-xs text-slate-600 font-medium">Enter job details and full description text for AI fraud risk diagnostic evaluation</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span>Words: <strong className="text-slate-900">{wordCount}</strong></span>
          <span>•</span>
          <span>Chars: <strong className="text-slate-900">{charCount}</strong></span>
        </div>
      </div>

      {/* Main Dual-Side Layout (Left Column 5 cols, Right Column 7 cols) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (5 columns): Presets & Structured Metadata Fields */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Benchmark Buttons Card */}
          <div className="white-card p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Test Presets Benchmark</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Click to autofill</span>
            </div>

            <div className="space-y-2">
              {DEMO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-800 transition group shadow-2xs flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <div className="font-bold group-hover:text-indigo-600 truncate">{preset.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{preset.data.company_name}</div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold shrink-0">Load →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Structured Metadata Inputs Card */}
          <div className="white-card p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-2">
              Structured Listing Details (Optional)
            </h3>

            <div className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Job Position Title</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company / Employer Name</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Stripe Inc."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote / SF"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salary / Earning Range</span>
                </label>
                <input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g. $140,000 - $170,000 / year"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact / Recruiter Email</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="e.g. hr@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Link className="w-3.5 h-3.5 text-slate-400" />
                  <span>Application Link URL</span>
                </label>
                <input
                  type="url"
                  name="application_url"
                  value={formData.application_url}
                  onChange={handleChange}
                  placeholder="https://company.com/careers/role"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (7 columns): Job Description Editor & Primary Action */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="white-card p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Job Description Input Text</span>
              </h2>
              <span className="text-xs text-rose-500 font-semibold">* Required</span>
            </div>

            <div>
              <textarea
                name="job_description"
                rows={14}
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Paste full job posting text, qualifications, responsibilities, salary claims, recruiter instructions, or email text here..."
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono leading-relaxed resize-y transition shadow-2xs"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Sanitized in real-time. Data is never shared publicly.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.job_description.trim()}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition shadow-md ${
                  isLoading || !formData.job_description.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Running ML Diagnostic...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Job Safety Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
