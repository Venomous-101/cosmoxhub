import { Metadata } from 'next';
import ResumeBuilderClient from './ResumeBuilderClient';
import { generateWebAppJsonLd } from '@/lib/seo-helpers';

export const metadata: Metadata = {
  title: 'Resume Builder Pro | Create Professional ATS-Friendly Resumes',
  description: 'Build a premium, professional resume in minutes with our high-quality builder. Privacy-focused, client-side generation with elite PDF templates.',
  keywords: ['resume builder', 'cv maker', 'professional resume', 'ATS friendly resume', 'free resume creator', 'premium cv designer'],
};

export default function ResumeBuilderPage() {
  const jsonLd = generateWebAppJsonLd({
    toolName: 'Resume Builder Pro',
    slug: 'resume-builder',
    description: 'Elite professional resume and CV builder with high-quality PDF export and ATS optimization.',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ResumeBuilderClient />

      {/* SEO Content Section */}
      <section className="mt-20 max-w-4xl mx-auto prose prose-invert">
        <h2 className="text-3xl font-bold text-white mb-6">Why Use Our Resume Builder Pro?</h2>
        <p className="text-zinc-400 leading-relaxed text-lg">
          In today&apos;s competitive job market, your resume is your first impression. Our <strong>Resume Builder Pro</strong> is designed to help you stand out 
          without the hassle of complex formatting tools. We combine beautiful, modern design with strict adherence to <strong>ATS (Applicant Tracking System)</strong> standards.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-purple-400 font-bold mb-2">Privacy First</h3>
            <p className="text-sm text-zinc-500">Your personal data never leaves your browser. All processing is done locally, ensuring 100% privacy and security for your sensitive information.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-purple-400 font-bold mb-2">High-Quality Export</h3>
            <p className="text-sm text-zinc-500">Generate professional, high-resolution PDF documents that look perfect on any screen or when printed for physical copies.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-purple-400 font-bold mb-2">Modern Aesthetics</h3>
            <p className="text-sm text-zinc-500">Forget outdated Word templates. Our builder uses elite design principles to create a visual identity that screams professionalism.</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-purple-400 font-bold mb-2">ATS Optimized</h3>
            <p className="text-sm text-zinc-500">We use clear hierarchy, standard fonts, and logical structures to ensure your resume passes through automated screening systems flawlessly.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-bold">Is this resume builder really free?</h4>
            <p className="text-zinc-400">Yes, the Resume Builder Pro is part of the CosmoxHub suite of high-utility tools and is completely free to use with no hidden subscriptions.</p>
          </div>
          <div>
            <h4 className="text-white font-bold">Can I save my resume and come back later?</h4>
            <p className="text-zinc-400">Absolutely. We use browser local storage to keep your data synced. As long as you use the same browser, your data will be waiting for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
