import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Book, User, Utensils, Droplets, Scale, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import perfilTutorial from "@/assets/perfil-tutorial.mov";
import medidasTutorial from "@/assets/medidas-tutorial.mov";
import adicionarAlimentoTutorial from "@/assets/adicionar-alimento-tutorial.mov";
import aguaTutorial from "@/assets/agua-tutorial.mov";
import substituicaoTutorial from "@/assets/substituicao-tutorial.mov";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Help = () => {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    toast({
      title: "Gerando PDF...",
      description: "Por favor aguarde enquanto preparamos seu guia.",
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Título
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Guia do Usuário - FitVerso", margin, yPosition);
      yPosition += 15;

      // Subtítulo
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Manual completo de uso da plataforma", margin, yPosition);
      yPosition += 15;

      // Seções do guia
      userGuide.forEach((guide, index) => {
        // Verifica se precisa de nova página
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        // Título da seção
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${guide.title}`, margin, yPosition);
        yPosition += 8;

        // Descrição
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        const descriptionLines = pdf.splitTextToSize(guide.description, pageWidth - 2 * margin);
        pdf.text(descriptionLines, margin, yPosition);
        yPosition += descriptionLines.length * 5 + 5;

        // Passos
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        guide.steps.forEach((step, stepIndex) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          const stepLines = pdf.splitTextToSize(`   ${stepIndex + 1}. ${step}`, pageWidth - 2 * margin - 5);
          pdf.text(stepLines, margin + 5, yPosition);
          yPosition += stepLines.length * 5 + 3;
        });

        yPosition += 8;
      });

      // FAQ
      pdf.addPage();
      yPosition = margin;
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Perguntas Frequentes", margin, yPosition);
      yPosition += 12;

      faqs.forEach((faq, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${faq.question}`, margin, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const answerLines = pdf.splitTextToSize(faq.answer, pageWidth - 2 * margin);
        pdf.text(answerLines, margin + 5, yPosition);
        yPosition += answerLines.length * 5 + 10;
      });

      // Salvar PDF
      pdf.save("Guia-Usuario-FitVerso.pdf");

      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu guia foi baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Guia do Usuário</h2>
              <p className="text-muted-foreground">
                Aprenda a usar todas as funcionalidades da plataforma passo a passo
              </p>
            </div>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
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