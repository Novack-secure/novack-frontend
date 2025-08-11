"use client";
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactDetails = () => {
  const details = [
    {
      icon: <Mail className="h-6 w-6 text-[#07D9D9]" />,
      title: "Email",
      value: "hello@novack.com",
      description: "For general inquiries and support.",
    },
    {
      icon: <Phone className="h-6 w-6 text-[#07D9D9]" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am - 5pm EST.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-[#07D9D9]" />,
      title: "Office",
      value: "123 Innovation Drive, Tech City, 12345",
      description: "Visits by appointment only.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Get in touch</h2>
        <p className="text-white/70 mt-2">
          We'd love to hear from you. Here's how you can reach us.
        </p>
      </div>
      <div className="space-y-6">
        {details.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-[#07D9D9] font-medium">{item.value}</p>
              <p className="text-white/60 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDetails;
