import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

interface AboutUsContent {
  title: string;
  teamMembers: TeamMember[];
  subtitle?: string;
  aboutUs: {
    title: string;
    description: string;
    subtitle?: string;
  };
  partners: {
    title: string;
    partners: Array<{
      name: string;
      logo: string;
    }>;
  };
}

export default function AboutUs() {
  const { data: pageData } = getMarkdownData<AboutUsContent>('pages', 'about-us.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "About Us - Meet Qedits' Professional Team | QEDIT",
            "description": "Want to know all About Us? So just Click Here and Meet Qedit Professional Team at your service! For Further Information About us - Click Here >>>",
            "url": "https://qed-it.com/about-us/",
            "dateModified": "2024-11-24T11:15:13+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white py-16 pb-52 md:pb-32 relative">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 sm:p-12">
            <h1 className="text-4xl font-semibold text-center md:text-left text-gray-900 mb-16">{pageData.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {pageData.teamMembers.slice(0, 3).map((member, index) => (
                <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="relative w-48 h-48 mb-6 self-center md:self-start">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="(max-width: 768px) 192px, 192px"
                    />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h2>
                  
                  <h3 className="text-lg text-gray-600 mb-4">
                    {member.role}
                  </h3>
                  
                  {member.bio && (
                    <p className="text-gray-600 mb-4">
                      {member.bio}
                    </p>
                  )}
                  
                  {member.socialLinks && (
                    <div className="flex space-x-4">
                      {member.socialLinks.twitter && (
                        <a 
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#38b1df]"
                        >
                          <span className="sr-only">X (Twitter)</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      
                      {member.socialLinks.linkedin && (
                        <a 
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#38b1df]"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pageData.teamMembers.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mt-16">
                {pageData.teamMembers.slice(3).map((member, index) => (
                  <div key={index + 3} className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="relative w-48 h-48 mb-6 self-center md:self-start">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full"
                        sizes="(max-width: 768px) 192px, 192px"
                      />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h2>
                    
                    <h3 className="text-lg text-gray-600 mb-4">
                      {member.role}
                    </h3>
                    
                    {member.bio && (
                      <p className="text-gray-600 mb-4">
                        {member.bio}
                      </p>
                    )}
                    
                    {member.socialLinks && (
                      <div className="flex space-x-4">
                        {member.socialLinks.twitter && (
                          <a 
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#38b1df]"
                          >
                            <span className="sr-only">X (Twitter)</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        
                        {member.socialLinks.linkedin && (
                          <a 
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#38b1df]"
                          >
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 sm:p-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {pageData.aboutUs.title}
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl">
              {pageData.aboutUs.subtitle}
            </p>
            
            <div className="prose prose-lg max-w-4xl">
              {pageData.aboutUs.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="bg-white md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-normal text-center mb-12">{pageData.partners.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {pageData.partners.partners.map((partner, index) => (
                <div key={index} className="relative h-12">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative stripes */}
        <div className="absolute bottom-0 right-0 pointer-events-none flex justify-end w-full">
          <Image
            src="/images/layout/stripes-02.png"
            alt="Decorative stripes"
            width={600}
            height={300}
            className="w-full h-auto md:w-[600px]"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: "About Us - Meet Qedits' Professional Team | QEDIT",
  description: "Want to know all About Us? So just Click Here and Meet Qedit Professional Team at your service! For Further Information About us - Click Here >>>",
  alternates: {
    canonical: 'https://qed-it.com/about-us/',
  },
  openGraph: {
    title: "About Us - Meet Qedits' Professional Team | QEDIT",
    description: "Want to know all About Us? So just Click Here and Meet Qedit Professional Team at your service! For Further Information About us - Click Here >>>",
    url: 'https://qed-it.com/about-us/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2024-11-24T11:15:13+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2024-11-24T11:15:13+00:00',
  }
}; 