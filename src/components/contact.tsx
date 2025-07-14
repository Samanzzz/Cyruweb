import { ContactForm } from "./contact-form";
import { Phone, Mail, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-secondary">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">Contact Us</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Have a groundbreaking idea? We'd love to hear from you.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Get in Touch</h3>
              <p className="text-muted-foreground mb-6">
                Reach out to our team directly. We are available for inquiries and partnership opportunities.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-foreground">(123) 456-7890</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground">contact@cyrutech.capital</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Our Locations</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">San Francisco</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">New York</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">London</span>
                </div>
                 <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Tokyo</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-lg border">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
