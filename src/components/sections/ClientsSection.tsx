import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clientService, { Client as ApiClient } from "../../lib/client-service";
import { API_BASE_URL } from "../../lib/constants";

interface Client {
  id: string;
  name: string;
  description: string;
  logo?: string;
  industry: string;
}

interface ClientsSectionProps {
  clients?: Client[];
}

// Define static default image paths to prevent infinite network requests
const DEFAULT_COMPANY_IMAGE = "/images/clients/business-group.png";
const DEFAULT_INDIVIDUAL_IMAGE = "/images/clients/individual-client.png";
const DEFAULT_CLIENT_IMAGE = "/images/default-client.png";

const ClientsSection = ({ clients: propClients }: ClientsSectionProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Map client type to industry name in Arabic
  const getIndustryFromType = (type: "company" | "individual"): string => {
    switch (type) {
      case "company":
        return "شركة";
      case "individual":
        return "فرد";
      default:
        return "أخرى";
    }
  };

  useEffect(() => {
    // If clients are provided as props, use them
    if (propClients && propClients.length > 0) {
      setClients(propClients);
      setLoading(false);
      return;
    }

    // Otherwise fetch clients from the API
    const fetchClients = async () => {
      try {
        setLoading(true);
        const fetchedClients = await clientService.getClients();
        
        // Map API clients to the format needed by this component
        const mappedClients = fetchedClients.map(client => ({
          id: client.id,
          name: client.company || client.name,
          description: client.company || `عميل في ${client.location || 'موقع غير محدد'}`,
          // Use real client image if available, otherwise use a static placeholder based on client type
          logo: client.image 
            ? client.image 
            : client.type === "company" 
              ? DEFAULT_COMPANY_IMAGE 
              : DEFAULT_INDIVIDUAL_IMAGE,
          industry: getIndustryFromType(client.type)
        }));
        
        setClients(mappedClients);
        setError(null);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("حدث خطأ أثناء تحميل بيانات العملاء");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [propClients]);

  // Logic to handle showing 4 clients at a time for the carousel
  const totalPages = Math.ceil(clients.length / 4);
  const visibleClients = clients.slice(currentPage * 4, (currentPage + 1) * 4);

  // Functions to navigate between pages
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-medium text-white">عملاؤنا</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            نفخر بثقة عملائنا في خدماتنا
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-lg bg-red-500/20 p-4 text-center text-red-100">
            {error}
          </div>
        ) : clients.length === 0 ? (
          <div className="mx-auto max-w-md rounded-lg bg-blue-500/20 p-4 text-center text-blue-100">
            لا يوجد عملاء لعرضهم حالياً
          </div>
        ) : (
          <div className="relative mt-16">
            {/* Prev button */}
            <button 
              onClick={goToPrevPage}
              className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-left-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            
            {/* Clients carousel */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {visibleClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="mb-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img
                      src={client.logo || DEFAULT_CLIENT_IMAGE}
                      alt={client.name}
                      className="h-24 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = DEFAULT_CLIENT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {client.name}
                    </h3>
                    <span className="inline-block rounded-full bg-[#FF6B00]/20 px-3 py-1 text-sm text-[#FF6B00]">
                      {client.industry || (client.description?.includes("عميل في") ? "فردي" : "شركة")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Next button */}
            <button 
              onClick={goToNextPage}
              className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-right-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            {/* Pagination dots */}
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentPage === index ? "w-6 bg-[#FF6B00]" : "bg-white/30"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300">
            انضم إلى قائمة عملائنا المميزين واستفد من خدماتنا المتكاملة
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
