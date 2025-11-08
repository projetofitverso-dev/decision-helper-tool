import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, User, Utensils, Droplets, Scale, RefreshCw } from "lucide-react";
import perfilTutorial from "@/assets/perfil-tutorial.mov";
import medidasTutorial from "@/assets/medidas-tutorial.mov";
import adicionarAlimentoTutorial from "@/assets/adicionar-alimento-tutorial.mov";
import aguaTutorial from "@/assets/agua-tutorial.mov";
import substituicaoTutorial from "@/assets/substituicao-tutorial.mov";

const Help = () => {
  const faqs = [
    {
      question: "Como adicionar um novo alimento?",
      answer: "Vá para a página 'Adicionar Alimento' no menu lateral e preencha as informações nutricionais do alimento.",
      video: adicionarAlimentoTutorial
    },
    {
      question: "Como registrar meu consumo de água?",
      answer: "Acesse 'Consumo de Água' no menu e registre a quantidade de água consumida ao longo do dia.",
      video: aguaTutorial
    },
    {
      question: "Posso editar minhas medidas corporais?",
      answer: "Sim, vá para 'Medidas Corporais' e clique no botão de editar para atualizar suas informações.",
      video: medidasTutorial
    },
    {
      question: "Como funciona a substituição de alimentos?",
      answer: "Na página 'Substituição de Alimentos', você pode buscar alternativas saudáveis para seus alimentos favoritos.",
      video: substituicaoTutorial
    },
    {
      question: "Como altero meu perfil?",
      answer: "Acesse 'Meu Perfil' no menu lateral para visualizar e editar suas informações pessoais.",
      video: perfilTutorial
    }
  ];

  const userGuide = [
    {
      icon: User,
      title: "Configurar Perfil",
      description: "Configure suas informações pessoais, objetivos e preferências alimentares",
      steps: [
        "Acesse 'Meu Perfil' no menu lateral",
        "Preencha seus dados pessoais",
        "Defina seus objetivos nutricionais",
        "Salve as alterações"
      ]
    },
    {
      icon: Scale,
      title: "Registrar Medidas",
      description: "Acompanhe sua evolução através das medidas corporais",
      steps: [
        "Vá para 'Medidas Corporais'",
        "Clique em 'Adicionar Nova Medida'",
        "Insira peso, altura e outras medidas",
        "Visualize seu histórico e progresso"
      ]
    },
    {
      icon: Utensils,
      title: "Adicionar Alimentos",
      description: "Registre os alimentos que você consome diariamente",
      steps: [
        "Acesse 'Adicionar Alimento'",
        "Preencha as informações nutricionais",
        "Defina a quantidade consumida",
        "Confirme o registro"
      ]
    },
    {
      icon: Droplets,
      title: "Controlar Hidratação",
      description: "Monitore seu consumo diário de água",
      steps: [
        "Entre em 'Consumo de Água'",
        "Registre cada vez que beber água",
        "Acompanhe sua meta diária",
        "Veja seu histórico de hidratação"
      ]
    },
    {
      icon: RefreshCw,
      title: "Substituir Alimentos",
      description: "Encontre alternativas saudáveis para seus alimentos",
      steps: [
        "Acesse 'Substituição de Alimentos'",
        "Busque o alimento que deseja substituir",
        "Veja sugestões de alternativas",
        "Compare valores nutricionais"
      ]
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
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>{faq.answer}</p>
                    {faq.video && (
                      <video 
                        controls 
                        className="w-full rounded-lg border"
                        preload="metadata"
                      >
                        <source src={faq.video} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* User Guide Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Guia do Usuário</h2>
          <p className="text-muted-foreground">
            Aprenda a usar todas as funcionalidades da plataforma passo a passo
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {userGuide.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <guide.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {guide.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Help;