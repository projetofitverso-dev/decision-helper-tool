import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, HelpCircle, Book, Users } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "Como adicionar um novo alimento?",
      answer: "Vá para a página 'Adicionar Alimento' no menu lateral e preencha as informações nutricionais do alimento."
    },
    {
      question: "Como registrar meu consumo de água?",
      answer: "Acesse 'Consumo de Água' no menu e registre a quantidade de água consumida ao longo do dia."
    },
    {
      question: "Posso editar minhas medidas corporais?",
      answer: "Sim, vá para 'Medidas Corporais' e clique no botão de editar para atualizar suas informações."
    },
    {
      question: "Como funciona a substituição de alimentos?",
      answer: "Na página 'Substituição de Alimentos', você pode buscar alternativas saudáveis para seus alimentos favoritos."
    },
    {
      question: "Como altero meu perfil?",
      answer: "Acesse 'Meu Perfil' no menu lateral para visualizar e editar suas informações pessoais."
    }
  ];

  const supportOptions = [
    {
      icon: Mail,
      title: "Email",
      description: "Envie-nos um email para suporte@fitverso.com",
      action: "Enviar Email"
    }
  ];

  const resources = [
    {
      icon: Book,
      title: "Guia do Usuário",
      description: "Manual completo de uso da plataforma"
    },
    {
      icon: HelpCircle,
      title: "Tutoriais em Vídeo",
      description: "Aprenda com nossos vídeos explicativos"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>
          <p className="text-muted-foreground">
            Como podemos ajudar você hoje?
          </p>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              Encontre respostas rápidas para as dúvidas mais comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Fale Conosco</h2>
          <div className="grid md:grid-cols-1 max-w-md mx-auto">
            {supportOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <option.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Recursos Úteis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <resource.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {resource.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Help;