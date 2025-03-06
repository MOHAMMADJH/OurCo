import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import clientService, { Client } from "@/lib/client-service";
import { Skeleton } from "@/components/ui/skeleton";
import ClientFormDialog from "@/components/clients/ClientFormDialog";
import ClientDeleteDialog from "@/components/clients/ClientDeleteDialog";
import ClientDetailsDialog from "@/components/clients/ClientDetailsDialog";

const getStatusColor = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500";
    case "inactive":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusText = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "نشط";
    case "inactive":
      return "غير نشط";
    default:
      return status;
  }
};

const getTypeColor = (type: Client["type"]) => {
  switch (type) {
    case "company":
      return "bg-blue-500/10 text-blue-500";
    case "individual":
      return "bg-purple-500/10 text-purple-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getTypeText = (type: Client["type"]) => {
  switch (type) {
    case "company":
      return "شركة";
    case "individual":
      return "فرد";
    default:
      return type;
  }
};

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل العملاء');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (data: any) => {
    try {
      await clientService.createClient(data);
      fetchClients();
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error creating client:', err);
      setError('حدث خطأ أثناء إنشاء العميل');
    }
  };

  const handleUpdateClient = async (id: string, data: any) => {
    try {
      await clientService.updateClient(id, data);
      fetchClients();
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error updating client:', err);
      setError('حدث خطأ أثناء تحديث العميل');
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id);
      fetchClients();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('حدث خطأ أثناء حذف العميل');
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة العملاء"
        subtitle="عرض وإدارة جميع العملاء"
      />

      <div className="p-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}
        
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن عميل..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF8533]"
            onClick={() => {
              setSelectedClient(null);
              setFormDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-4 w-32" />
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="mb-4 h-4 w-40" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.length === 0 ? (
              <div className="col-span-full rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-400">
                لم يتم العثور على عملاء
              </div>
            ) : (
              filteredClients.map((client) => (
                <Card
                  key={client.id}
                  className="border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(client.status)}>
                          {getStatusText(client.status)}
                        </Badge>
                        <Badge className={getTypeColor(client.type)}>
                          {getTypeText(client.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                          onClick={() => {
                            setSelectedClient(client);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                          onClick={() => {
                            setSelectedClient(client);
                            setFormDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => {
                            setSelectedClient(client);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-white">
                      {client.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-400">{client.company}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="h-4 w-4" />
                        {client.location}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-sm text-gray-400">المشاريع:</span>{" "}
                          <span className="text-sm font-medium">
                            {client.projects_count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">إجمالي القيمة:</span>{" "}
                          <span className="text-sm font-medium">
                            {(client.total_value || 0).toLocaleString()} ر.س
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Client Form Dialog */}
      <ClientFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={(data) => {
          if (selectedClient) {
            handleUpdateClient(selectedClient.id, data);
          } else {
            handleCreateClient(data);
          }
        }}
        defaultValues={selectedClient || {}}
      />

      {/* Client Delete Dialog */}
      {selectedClient && (
        <ClientDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => handleDeleteClient(selectedClient.id)}
          clientName={selectedClient.name}
        />
      )}

      {/* Client Details Dialog */}
      {selectedClient && (
        <ClientDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          clientId={selectedClient.id}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientsPage;
