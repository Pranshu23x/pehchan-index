'use client';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e]/5 backdrop-blur-sm border-t border-[#1a1a2e]/10">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f9017d5e-73bf-44cc-9774-6f7da4784972/image-1767439313415.png?width=8000&height=8000&resize=contain" 
              alt="Pehchaan Index Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-semibold text-[#1a1a2e] text-sm">Pehchaan Index</span>
          </div>
          <p className="text-xs text-[#4a5568] text-center sm:text-left">
            Hackathon Submission for UIDAI Data Hackathon · Developed by Team BitBlitz
          </p>
        </div>
      </div>
    </footer>
  );
}
