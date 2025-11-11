"use client";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactDetails = () => {
  const details = [
    {
      icon: <Mail className="h-6 w-6 text-[#0386D9]" />,
      title: "Email",
      value: "hello@novack.com",
      description: "Para consultas generales y soporte.",
    },
    {
      icon: <Phone className="h-6 w-6 text-[#0386D9]" />,
      title: "Teléfono",
      value: "+1 (555) 123-4567",
      description: "Lun-Vie, 9am - 5pm EST.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-[#0386D9]" />,
      title: "Oficina",
      value: "123 Innovation Drive, Tech City, 12345",
      description: "Visitas solo con cita previa.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Ponte en contacto</h2>
        <p className="text-white/70 mt-2">
          Nos encantaría saber de ti. Así es como puedes contactarnos.
        </p>
      </div>
      <div className="space-y-6">
        {details.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-[#0386D9] font-medium">{item.value}</p>
              <p className="text-white/60 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDetails;
