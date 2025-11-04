import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  Users,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { animations } from "@/lib/animations";

const Help = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Add entrance animations
  useEffect(() => {
    if (containerRef.current) {
      // Animate the main container
      animations.fadeInUp(containerRef.current);

      const sections = sectionsRef.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      if (sections.length > 0) {
        animations.staggerFadeInUp(sections, 0.1);
      }
    }
  }, []);

  const quickLinks = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Learn the basics of using Maglo",
      link: "#",
      color: "text-blue-600",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials",
      link: "#",
      color: "text-green-600",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete API and feature documentation",
      link: "#",
      color: "text-purple-600",
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other users",
      link: "#",
      color: "text-orange-600",
    },
  ];

  const faqs = [
    {
      question: "How do I create my first invoice?",
      answer:
        "To create your first invoice, navigate to the Invoices section from the dashboard, click 'New Invoice', fill in the required details including client information, line items, and amounts. The system will automatically calculate totals including taxes and discounts.",
    },
    {
      question: "Can I customize my invoice templates?",
      answer:
        "Yes! You can customize your invoice templates by going to Settings > Invoice Templates. You can modify colors, add your logo, change layout styles, and set default terms and conditions.",
    },
    {
      question: "How do I track payments?",
      answer:
        "Payment tracking is automatic once you send an invoice. You can view payment status in the Invoices section, and you'll receive notifications when payments are received. You can also manually mark invoices as paid.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support all major payment methods including credit cards (Visa, MasterCard, American Express), bank transfers, PayPal, and digital wallets like Apple Pay and Google Pay.",
    },
    {
      question: "How do I export my data?",
      answer:
        "You can export your data anytime from Settings > Data Export. Choose from various formats including CSV, PDF, or JSON. You can export invoices, client data, and transaction history.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! We use bank-level encryption (SSL/TLS), regular security audits, and comply with international data protection standards including GDPR. Your data is backed up daily and stored securely.",
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      available: "Available 24/7",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      action: "Send Email",
      available: "Response within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call our support hotline",
      action: "Call Now",
      available: "Mon-Fri, 9AM-6PM EST",
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-8 max-w-6xl opacity-0">
      {/* Header */}
      <div
        ref={(el) => (sectionsRef.current[0] = el)}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Find answers, get support, and learn how to make the most of Maglo
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, features, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div
        ref={(el) => (sectionsRef.current[1] = el)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <link.icon className={`h-6 w-6 ${link.color}`} />
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {link.description}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">
            Quick answers to common questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <span className="font-semibold">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-4">
                  <Separator className="mb-4" />
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No FAQs found matching "{searchQuery}". Try a different search
                term or contact support.
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Contact Support */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Still need help?</h2>
          <p className="text-muted-foreground mt-2">
            Our support team is here to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-6 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{option.title}</h3>
                <p className="text-muted-foreground">{option.description}</p>
                <p className="text-sm text-primary font-medium">
                  {option.available}
                </p>
              </div>
              <Button className="w-full">{option.action}</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-accent/30 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Additional Resources</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive resources to get the most out of Maglo
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button variant="outline">
              <Book className="h-4 w-4 mr-2" />
              User Manual
            </Button>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Video Library
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              API Docs
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
