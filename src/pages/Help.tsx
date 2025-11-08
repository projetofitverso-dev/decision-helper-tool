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
      description: "Por favor aguarde enquanto preparamos seu guia completo.",
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Função auxiliar para adicionar linha
      const addLine = (y: number) => {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y, pageWidth - margin, y);
      };

      // Função auxiliar para adicionar caixa colorida
      const addColorBox = (y: number, text: string) => {
        pdf.setFillColor(59, 130, 246);
        pdf.rect(margin, y - 5, pageWidth - 2 * margin, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.text(text, margin + 3, y + 2);
      };

      // Capa
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 80, 'F');
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Guia FitVerso", pageWidth / 2, 40, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text("Manual Completo do Usuário", pageWidth / 2, 55, { align: 'center' });
      
      yPosition = 100;
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      const welcomeText = "Oi! Eu sou o FitVerso! Vamos aprender juntos como usar todas as funcionalidades da plataforma? Este guia vai te ajudar passo a passo na sua jornada de bem-estar!";
      const welcomeLines = pdf.splitTextToSize(welcomeText, pageWidth - 2 * margin);
      pdf.text(welcomeLines, margin, yPosition);
      yPosition += welcomeLines.length * 6 + 15;

      // Índice
      pdf.setFontSize(18);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Índice", margin, yPosition);
      yPosition += 10;
      addLine(yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      userGuide.forEach((guide, index) => {
        pdf.text(`${index + 1}. ${guide.title}`, margin + 5, yPosition);
        yPosition += 7;
      });

      // Início das seções
      userGuide.forEach((guide, index) => {
        pdf.addPage();
        yPosition = margin;

        // Cabeçalho da seção
        addColorBox(yPosition, `${index + 1}. ${guide.title}`);
        yPosition += 15;

        // Descrição
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        const descLines = pdf.splitTextToSize(guide.description, pageWidth - 2 * margin);
        pdf.text(descLines, margin, yPosition);
        yPosition += descLines.length * 6 + 10;

        // Passo a passo
        pdf.setFontSize(14);
        pdf.setTextColor(59, 130, 246);
        pdf.text("Passo a Passo:", margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        guide.steps.forEach((step, stepIndex) => {
          // Círculo numerado
          pdf.setFillColor(59, 130, 246);
          pdf.circle(margin + 3, yPosition - 2, 3, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(8);
          pdf.text(`${stepIndex + 1}`, margin + 3, yPosition, { align: 'center' });
          
          // Texto do passo
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          const stepLines = pdf.splitTextToSize(step, pageWidth - 2 * margin - 15);
          pdf.text(stepLines, margin + 10, yPosition);
          yPosition += stepLines.length * 6 + 8;
        });

        // Dicas específicas para cada seção
        yPosition += 5;
        pdf.setFillColor(255, 248, 220);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'F');
        pdf.setFontSize(11);
        pdf.setTextColor(184, 134, 11);
        pdf.text("💡 Dica FitVerso:", margin + 3, yPosition + 2);
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        
        let tip = "";
        switch (index) {
          case 0:
            tip = "Mantenha seus dados sempre atualizados para ter recomendações mais precisas. Revise seu perfil mensalmente!";
            break;
          case 1:
            tip = "Tire suas medidas sempre no mesmo horário e condições. O melhor momento é pela manhã, antes do café!";
            break;
          case 2:
            tip = "Seja detalhado ao adicionar alimentos. Quanto mais informações, melhor será o controle nutricional!";
            break;
          case 3:
            tip = "Beba água ao longo do dia, não tudo de uma vez. Configure lembretes para não esquecer!";
            break;
          case 4:
            tip = "Experimente novas alternativas! Diversificar a alimentação traz mais nutrientes e sabor!";
            break;
        }
        const tipLines = pdf.splitTextToSize(tip, pageWidth - 2 * margin - 8);
        pdf.text(tipLines, margin + 3, yPosition + 8);
      });

      // Página de FAQs
      pdf.addPage();
      yPosition = margin;
      addColorBox(yPosition, "Perguntas Frequentes");
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      const faqIntro = "Aqui estão as respostas para as dúvidas mais comuns dos nossos usuários:";
      pdf.text(faqIntro, margin, yPosition);
      yPosition += 10;

      faqs.forEach((faq, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Pergunta
        pdf.setFontSize(11);
        pdf.setTextColor(59, 130, 246);
        pdf.text(`Q${index + 1}: ${faq.question}`, margin, yPosition);
        yPosition += 7;

        // Resposta
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        const answerLines = pdf.splitTextToSize(`R: ${faq.answer}`, pageWidth - 2 * margin);
        pdf.text(answerLines, margin + 5, yPosition);
        yPosition += answerLines.length * 5 + 8;
      });

      // Página final motivacional
      pdf.addPage();
      yPosition = pageHeight / 2 - 30;
      
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Continue Evoluindo!", pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      const finalText = "Cada passo conta na sua jornada de bem-estar. O FitVerso está aqui para te apoiar em cada conquista. Cuide-se, alimente-se bem e mantenha-se hidratado!";
      const finalLines = pdf.splitTextToSize(finalText, pageWidth - 2 * margin - 20);
      pdf.text(finalLines, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += finalLines.length * 7 + 10;
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("© FitVerso - Sua jornada de bem-estar", pageWidth / 2, yPosition, { align: 'center' });

      // Salvar PDF
      pdf.save("Guia-Completo-FitVerso.pdf");

      toast({
        title: "PDF gerado com sucesso! 🎉",
        description: "Seu guia completo foi baixado.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
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