import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { useEffect, useState } from 'react';
import { ChevronUp, Phone, Mail, Globe, Menu, X, ChevronRight, FileText, Shield, RefreshCw, Cookie } from 'lucide-react';

// Mobile detection hook
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

// SEO and Mobile Meta Tags Hook
const usePrivacySEO = () => {
    useEffect(() => {
        document.title = "Privacy Policy | Fab Clean - Premium Laundry Services";

        // Mobile viewport meta
        let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

        // Theme color
        let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            document.head.appendChild(themeColor);
        }
        themeColor.content = '#3b82f6';

        const metaTags = [
            { name: "description", content: "Fab Clean's Privacy Policy explains how we collect, use, and protect your personal information." },
            { name: "keywords", content: "fab clean privacy, data protection, personal information, laundry privacy policy" },
            { property: "og:title", content: "Privacy Policy | Fab Clean" },
            { property: "og:description", content: "Learn how Fab Clean protects your privacy and personal data." },
            { property: "og:type", content: "website" },
        ];

        const addedMetas: HTMLMetaElement[] = [];
        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            Object.entries(tag).forEach(([key, value]) => meta.setAttribute(key, value));
            document.head.appendChild(meta);
            addedMetas.push(meta);
        });

        // Add mobile-friendly styles
        const style = document.createElement('style');
        style.id = 'privacy-mobile-styles';
        style.textContent = `
            html {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
            .safe-area-top {
                padding-top: env(safe-area-inset-top, 0px);
            }
            .safe-area-bottom {
                padding-bottom: env(safe-area-inset-bottom, 16px);
            }
            .touch-target {
                min-height: 44px;
                min-width: 44px;
            }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            @keyframes slide-up {
                0% { transform: translateY(10px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        `;
        document.head.appendChild(style);

        return () => {
            document.title = "Fab Clean - Premium Laundry & Dry Cleaning";
            addedMetas.forEach(meta => meta.remove());
            const existingStyle = document.getElementById('privacy-mobile-styles');
            if (existingStyle) existingStyle.remove();
        };
    }, []);
};

const privacyData = {
    effectiveDate: "January 1, 2025",
    lastUpdated: "December 19, 2024",
    sections: [
        {
            id: 1,
            title: "Information We Collect",
            shortTitle: "Data Collection",
            content: `We collect information you provide directly to us, including:

PERSONAL INFORMATION: When you create an account, place an order, or contact us, we collect your name, email address, phone number, physical address, and payment information.

ORDER INFORMATION: We collect details about your orders, including garment types, special instructions, service preferences, pickup and delivery addresses, and transaction history.

DEVICE INFORMATION: When you use our website or mobile app, we automatically collect device information such as IP address, browser type, operating system, and device identifiers.

USAGE DATA: We collect information about how you interact with our services, including pages visited, features used, time spent on pages, and navigation patterns.`
        },
        {
            id: 2,
            title: "How We Use Your Information",
            shortTitle: "Data Usage",
            content: `We use the information we collect for the following purposes:

SERVICE DELIVERY: To process your orders, manage pickups and deliveries, provide customer support, and communicate about your services.

ACCOUNT MANAGEMENT: To create and maintain your account, authenticate your identity, and manage your preferences.

PAYMENT PROCESSING: To process payments, detect and prevent fraud, and comply with financial regulations.

IMPROVEMENTS: To analyze usage patterns, improve our services, develop new features, and enhance user experience.`
        },
        {
            id: 3,
            title: "Information Sharing",
            shortTitle: "Sharing",
            content: `We may share your information in the following circumstances:

SERVICE PROVIDERS: We share information with third-party service providers who perform services on our behalf, including payment processing, delivery services, SMS/WhatsApp notifications, cloud hosting, and customer support tools.

LEGAL REQUIREMENTS: We may disclose information when required by law, court order, or government regulation.

BUSINESS TRANSFERS: In connection with a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred to the acquiring entity.`
        },
        {
            id: 4,
            title: "Data Security",
            shortTitle: "Security",
            content: `We implement robust security measures to protect your personal information:

ENCRYPTION: All data transmitted between your device and our servers is encrypted using industry-standard TLS/SSL protocols.

ACCESS CONTROLS: We implement strict access controls, limiting employee access to personal information.

SECURITY MONITORING: We continuously monitor our systems for security threats and vulnerabilities.

SECURE PAYMENTS: Payment information is processed through PCI-DSS compliant payment processors.`
        },
        {
            id: 5,
            title: "Your Privacy Rights",
            shortTitle: "Your Rights",
            content: `You have the following rights regarding your personal information:

ACCESS: You can request a copy of the personal information we hold about you.

CORRECTION: You can request that we correct any inaccurate or incomplete information.

DELETION: You can request that we delete your personal information, subject to certain legal exceptions.

OPT-OUT: You can opt out of receiving promotional communications at any time.

To exercise these rights, contact us at privacy@myfabclean.com or call +91 93630 59595.`
        },
        {
            id: 6,
            title: "Cookies & Tracking",
            shortTitle: "Cookies",
            content: `We use cookies and similar tracking technologies:

ESSENTIAL COOKIES: Required for basic website functionality.

PERFORMANCE COOKIES: Help us understand how visitors use our website.

FUNCTIONALITY COOKIES: Remember your preferences and settings.

For detailed information, please see our separate Cookie Policy.`
        },
        {
            id: 7,
            title: "Contact Us",
            shortTitle: "Contact",
            content: `For questions about this Privacy Policy or our data practices:

DATA PROTECTION OFFICER:
Email: privacy@myfabclean.com
Phone: +91 93630 59595

GRIEVANCE OFFICER (India):
Name: Fab Clean Privacy Team
Email: grievance@myfabclean.com
Address: #16, Venkatramana Round Road, Opp Naturals/HDFC Bank, Mahalingapuram, Pollachi - 642002, Tamil Nadu, India

Response time: We aim to respond to privacy inquiries within 48 hours.`
        }
    ]
};

export default function PrivacyPage() {
    usePrivacySEO();
    const isMobile = useIsMobile();
    const currentYear = new Date().getFullYear();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showMobileToc, setShowMobileToc] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <div className="pt-32 pb-20 container-wide">
            {/* Header */}
            

            {/* Hero Section */}
            <div className="bg-transparent text-foreground py-10 md:py-16">
                <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                    </p>
                    <div className="mt-4 md:mt-6 flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                        <span>Effective: {privacyData.effectiveDate}</span>
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        <span>Updated: {privacyData.lastUpdated}</span>
                    </div>
                </div>
            </div>

            {/* Legal Navigation - Mobile Optimized */}
            <div className="bg-card border-b border-border/10 py-3 md:py-4">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
                        <Link href="/terms" className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm text-muted-foreground hover:text-primary/90 hover:bg-primary/5 rounded-full transition-colors whitespace-nowrap touch-target">
                            <FileText className="w-3 h-3 md:w-4 md:h-4" />
                            Terms
                        </Link>
                        <span className="px-3 py-2 text-xs md:text-sm bg-primary/10 text-primary rounded-full font-medium whitespace-nowrap flex items-center gap-1.5">
                            <Shield className="w-3 h-3 md:w-4 md:h-4" />
                            Privacy
                        </span>
                        <Link href="/refund" className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors whitespace-nowrap touch-target">
                            <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                            Refund
                        </Link>
                        <Link href="/cookies" className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors whitespace-nowrap touch-target">
                            <Cookie className="w-3 h-3 md:w-4 md:h-4" />
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile TOC Button */}
            {isMobile && (
                <button
                    onClick={() => setShowMobileToc(true)}
                    className="fixed bottom-20 left-4 z-40 bg-primary text-foreground p-3 rounded-full shadow-lg touch-target active:scale-95 transition-transform"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Mobile TOC Drawer */}
            {isMobile && showMobileToc && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
                        onClick={() => setShowMobileToc(false)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card z-50 shadow-xl animate-slide-up overflow-y-auto">
                        <div className="p-4 border-b border-border/10 flex items-center justify-between sticky top-0 bg-card">
                            <h3 className="font-semibold text-foreground">Quick Jump</h3>
                            <button onClick={() => setShowMobileToc(false)} className="p-2 touch-target">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {privacyData.sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setShowMobileToc(false);
                                        document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full flex items-center gap-3 p-3 bg-background rounded-lg touch-target active:scale-95 transition-transform text-left"
                                >
                                    <span className="w-8 h-8 flex items-center justify-center bg-primary text-foreground font-semibold rounded-lg text-sm">
                                        {section.id}
                                    </span>
                                    <span className="text-foreground/80 text-sm">{section.shortTitle}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto" />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Table of Contents - Desktop */}
                {!isMobile && (
                    <div className="bg-background rounded-xl p-6 md:p-8 mb-8 md:mb-12">
                        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Table of Contents</h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {privacyData.sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-3 p-3 bg-card rounded-lg hover:shadow-md transition-shadow text-left group"
                                >
                                    <span className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-semibold rounded-lg text-sm group-hover:bg-primary group-hover:text-foreground transition-colors">
                                        {section.id}
                                    </span>
                                    <span className="text-foreground/80 group-hover:text-primary transition-colors">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sections */}
                <div className="space-y-8 md:space-y-12">
                    {privacyData.sections.map((section) => (
                        <section key={section.id} id={`section-${section.id}`} className="scroll-mt-32">
                            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                                <span className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary text-foreground font-bold rounded-xl text-base md:text-lg">
                                    {section.id}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground pt-1 md:pt-2">
                                    {isMobile ? section.shortTitle : section.title}
                                </h2>
                            </div>
                            <div className="pl-0 md:pl-16">
                                <div className="prose prose-invert text-muted-foreground max-w-none">
                                    {section.content.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 left-4 z-40 bg-primary text-foreground p-3 rounded-full shadow-lg touch-target active:scale-95 transition-transform animate-fade-in"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            )}

            {/* Footer */}
            
        </div>
        </AppLayout>
    );
}
