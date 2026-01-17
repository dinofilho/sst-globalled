import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  type: 'product' | 'employee' | 'cashflow' | 'exam' | 'epi' | 'program' | 'nr';
  title: string;
  subtitle: string;
  tab: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { selectedBusiness } = useBusiness();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (query.length > 2 && selectedBusiness) {
      searchAll();
    } else {
      setResults([]);
    }
  }, [query, selectedBusiness]);

  const searchAll = async () => {
    if (!selectedBusiness) return;

    const searchResults: SearchResult[] = [];

    try {
      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('name', `%${query}%`)
        .limit(5);

      products?.forEach(p => {
        searchResults.push({
          id: p.id,
          type: 'product',
          title: p.name,
          subtitle: `Estoque: ${p.quantity} | R$ ${p.price}`,
          tab: 'stock',
        });
      });

      // Search employees
      const { data: employees } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('name', `%${query}%`)
        .limit(5);

      employees?.forEach(e => {
        searchResults.push({
          id: e.id,
          type: 'employee',
          title: e.name,
          subtitle: e.role,
          tab: 'employees',
        });
      });

      // Search cash flows
      const { data: cashFlows } = await supabase
        .from('cash_flows')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('description', `%${query}%`)
        .limit(5);

      cashFlows?.forEach(cf => {
        searchResults.push({
          id: cf.id,
          type: 'cashflow',
          title: cf.description,
          subtitle: `${cf.type === 'income' ? 'Receita' : 'Despesa'} | R$ ${cf.amount}`,
          tab: 'cashflow',
        });
      });

      // Search medical exams
      const { data: exams } = await supabase
        .from('medical_exams')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('employee_name', `%${query}%`)
        .limit(5);

      exams?.forEach(e => {
        searchResults.push({
          id: e.id,
          type: 'exam',
          title: e.employee_name,
          subtitle: `Exame ${e.exam_type} - ${new Date(e.exam_date).toLocaleDateString('pt-BR')}`,
          tab: 'exams',
        });
      });

      // Search EPIs
      const { data: epis } = await supabase
        .from('epis')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('name', `%${query}%`)
        .limit(5);

      epis?.forEach(epi => {
        searchResults.push({
          id: epi.id,
          type: 'epi',
          title: epi.name,
          subtitle: `CA: ${epi.ca_number} | Qtd: ${epi.quantity}`,
          tab: 'epi',
        });
      });

      // Search SST programs
      const { data: programs } = await supabase
        .from('sst_programs')
        .select('*')
        .eq('business_id', selectedBusiness)
        .ilike('title', `%${query}%`)
        .limit(5);

      programs?.forEach(p => {
        searchResults.push({
          id: p.id,
          type: 'program',
          title: p.title,
          subtitle: `${p.program_type} - Válido até ${new Date(p.valid_until).toLocaleDateString('pt-BR')}`,
          tab: 'programs',
        });
      });

      // Search NRs
      const { data: nrs } = await supabase
        .from('nrs')
        .select('*')
        .eq('business_id', selectedBusiness)
        .or(`nr_number.ilike.%${query}%,title.ilike.%${query}%`)
        .limit(5);

      nrs?.forEach(nr => {
        searchResults.push({
          id: nr.id,
          type: 'nr',
          title: `${nr.nr_number} - ${nr.title}`,
          subtitle: `Status: ${nr.compliance_status === 'compliant' ? 'Conforme' : nr.compliance_status === 'non_compliant' ? 'Não conforme' : 'Em andamento'}`,
          tab: 'nrs',
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(`/dashboard?tab=${result.tab}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar... (Ctrl+K)"
          className="pl-10 w-[300px]"
          readOnly
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Busca Global</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Digite para buscar..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {results.length === 0 && query.length > 2 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum resultado encontrado
                </p>
              )}
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(result)}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
