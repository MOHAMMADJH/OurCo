import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import serviceService from '@/lib/service-service';
import authService from '@/lib/auth-service';

interface Service {
  id: number;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  features: string[];
  category: number;
  image_url?: string;
}

interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  content: string;
  rating: number;
  service: number;
  created_at: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: number;
  order?: number;
}

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { currentLang, isRTL } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    client_name: '',
    client_title: '',
    content: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceData = await serviceService.getService(Number(id));
        setService(serviceData);
        const testimonialsData = await serviceService.getTestimonials({ service: id });
        setTestimonials(testimonialsData);
        const faqsData = await serviceService.getFAQs({ service: id });
        setFaqs(faqsData);
      } catch (err) {
        setError('Failed to load service details');
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isAuthenticated()) {
      setError('Please login to submit a testimonial');
      return;
    }

    setLoading(true);
    try {
      const testimonial = await serviceService.createTestimonial({
        ...newTestimonial,
        service: Number(id)
      });
      setTestimonials([...testimonials, testimonial]);
      setNewTestimonial({
        client_name: '',
        client_title: '',
        content: '',
        rating: 5
      });
    } catch (err) {
      setError('Failed to submit testimonial');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar initialLang={currentLang} />
        <main className="pt-20 container mx-auto px-4">
          <p className="text-center text-gray-400">
            {error || 'Loading...'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20 container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{service.title}</CardTitle>
            {service.price && (
              <p className="text-xl font-semibold text-primary">
                ${service.price} {service.duration && `/ ${service.duration}`}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p>{service.description}</p>
              {service.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
                  <ul className="list-disc pl-6">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {faqs.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Client Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestimonialSubmit} className="mb-8 space-y-4">
              <Input
                placeholder="Your Name"
                value={newTestimonial.client_name}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, client_name: e.target.value }))}
                required
              />
              <Input
                placeholder="Your Title/Company (Optional)"
                value={newTestimonial.client_title}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, client_title: e.target.value }))}
              />
              <Textarea
                placeholder="Your Testimonial"
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </form>

            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{testimonial.client_name}</h4>
                        {testimonial.client_title && (
                          <p className="text-sm text-gray-400">{testimonial.client_title}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{testimonial.content}</p>
                    <p className="text-sm text-gray-400 mt-4">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ServiceDetailPage;