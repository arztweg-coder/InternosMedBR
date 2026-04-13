import { ArrowLeft, FileText, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <div className="flex items-center gap-2 text-teal-600">
            <FileText className="w-6 h-6" />
            <span className="font-bold text-lg">Termos de Uso</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Título Principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CONTRATO DE PRESTAÇÃO DE SERVIÇO DIGITAL
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">
              TERMOS DE USO E POLÍTICA DE PRIVACIDADE
            </h2>
            <p className="text-gray-600">
              Plataforma InternosMed — <span className="font-semibold">internos.med.br</span>
            </p>
            <p className="text-gray-600">
              Desenvolvido e mantido por <span className="font-semibold">ArztWEG</span>
            </p>
          </div>

          {/* Metadados */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Última atualização: Março de 2026</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <a href="mailto:contato@arztweg.com" className="text-teal-600 hover:underline">
                contato@arztweg.com
              </a>
            </div>
          </div>

          {/* Conteúdo do Contrato */}
          <div className="prose prose-sm md:prose max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">PREÂMBULO</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O presente instrumento regula as condições de uso da plataforma <strong>InternosMed</strong>, 
                acessível pelo domínio <strong>internos.med.br</strong>, desenvolvida e mantida por 
                <strong> ArztWEG</strong> (doravante denominada "PRESTADORA"), em favorecimento não oneroso 
                com os colaboradores do Hospital das Clínicas da Universidade Federal de Goiás (HC-UFG), 
                vinculado à Empresa Brasileira de Serviços Hospitalares (EBSERH).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                A plataforma InternosMed destina-se exclusivamente ao apoio assistencial e educacional de 
                internos, residentes, médicos e demais colaboradores do HC-UFG, disponibilizando ferramentas 
                como modelos de documentos médicos, calculadoras clínicas, escores e roteiros de anamnese, 
                com o objetivo de otimizar o atendimento ambulatorial e hospitalar.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                <p className="text-gray-800 font-semibold">
                  Ao cadastrar-se e utilizar a plataforma, o usuário (doravante denominado "USUÁRIO") 
                  declara ter lido integralmente o presente contrato e manifesta sua aceitação plena, 
                  livre e informada de todas as cláusulas aqui dispostas, nos termos do artigo 7º, 
                  inciso I, da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 1ª — DO OBJETO</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>1.1.</strong> O presente contrato tem por objeto estabelecer as condições gerais 
                de acesso e utilização da plataforma digital InternosMed (internos.med.br), que disponibiliza 
                aos USUÁRIOS as seguintes funcionalidades:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Calculadoras clínicas e escores médicos validados, distribuídos em 13 (treze) especialidades;</li>
                <li>Modelos padronizados de documentos médicos (receituários, atestados, relatórios, encaminhamentos);</li>
                <li>Roteiros estruturados de anamnese para 20 (vinte) especialidades;</li>
                <li>Ferramentas de apoio à decisão clínica baseadas em evidências;</li>
                <li>Aplicação progress web (PWA), instalável em dispositivos móveis e desktops.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>1.2.</strong> A plataforma constitui ferramenta de apoio e não substitui o 
                julgamento clínico do profissional de saúde. Os resultados gerados por calculadoras e 
                escores devem ser interpretados pelo USUÁRIO à luz do contexto clínico individual de cada paciente.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 2ª — DA GRATUIDADE</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>2.1.</strong> O acesso à plataforma InternosMed é de caráter inteiramente gratuito, 
                por prazo indeterminado, não gerando qualquer obrigação financeira ao USUÁRIO.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>2.2.</strong> A PRESTADORA reserva-se o direito de, a qualquer tempo e mediante 
                prévio aviso de 30 (trinta) dias, alterar o modelo de disponibilização do serviço, podendo 
                instituir planos pagos para funcionalidades adicionais, desde que mantido o acesso básico 
                gratuito às ferramentas essenciais.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 3ª — DAS DOAÇÕES</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>3.1.</strong> A plataforma disponibiliza código QR (QR Code) para o recebimento 
                de doações voluntárias, destinadas exclusivamente ao custeio de manutenção, hospedagem, 
                desenvolvimento e aprimoramento da plataforma.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>3.2.</strong> As doações têm natureza de liberalidade, sendo inteiramente voluntárias, 
                irrevogáveis após a confirmação do pagamento, e não geram qualquer direito, contraprestação, 
                obrigação, vínculo empregatício ou preferencial entre o doador e a PRESTADORA.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>3.3.</strong> A PRESTADORA não se obriga a prestar contas individualizadas ao 
                doador sobre a destinação dos recursos, ressalvadas as obrigações tributárias e fiscais aplicáveis.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 4ª — DO ACESSO À PLATAFORMA</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.1.</strong> O acesso à plataforma é restrito aos colaboradores do HC-UFG que 
                possuam e-mail institucional ativo nos seguintes domínios autorizados:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li><strong>@ufg.br</strong> — docentes e servidores da Universidade Federal de Goiás;</li>
                <li><strong>@discente.ufg.br</strong> — acadêmicos e internos da UFG;</li>
                <li><strong>@ebserh.gov.br</strong> — colaboradores da EBSERH vinculados ao HC-UFG.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.2.</strong> A autenticação será realizada exclusivamente por meio do serviço 
                Google Sign-In, vinculado ao e-mail institucional do USUÁRIO. A PRESTADORA não armazena 
                senhas de acesso.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.3.</strong> O USUÁRIO é o único responsável pela segurança de suas credenciais 
                de acesso ao e-mail institucional e, por consequência, à plataforma. A PRESTADORA não se 
                responsabiliza por acessos indevidos decorrentes de comprometimento das credenciais do USUÁRIO.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>4.4.</strong> A PRESTADORA reserva-se o direito de suspender ou revogar, a qualquer 
                tempo e sem aviso prévio, o acesso de USUÁRIOS que utilizem a plataforma de forma indevida, 
                em desacordo com este contrato ou com a legislação vigente.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 14ª — DOS CANAIS DE COMUNICAÇÃO</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>14.1.</strong> Para quaisquer solicitações, sugestões, dúvidas, reclamações, 
                exercício de direitos do titular de dados ou comunicação de incidentes, o USUÁRIO deverá 
                utilizar os seguintes canais:
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                <p className="text-gray-800 font-semibold mb-2">E-mails da plataforma:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>
                    <Mail className="w-4 h-4 inline mr-2" />
                    <a href="mailto:contato@arztweg.com" className="text-teal-600 hover:underline">
                      contato@arztweg.com
                    </a>
                  </li>
                  <li>
                    <Mail className="w-4 h-4 inline mr-2" />
                    <a href="mailto:internos.med@arztweg.com" className="text-teal-600 hover:underline">
                      internos.med@arztweg.com
                    </a>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>14.2.</strong> A PRESTADORA compromete-se a responder às solicitações dos USUÁRIOS 
                no prazo de até 15 (quinze) dias úteis, nos termos do artigo 18, § 5º, da LGPD.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CLÁUSULA 16ª — DO FORO</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>16.1.</strong> Fica eleito o Foro da Comarca de Goiânia, Estado de Goiás, para 
                dirimir quaisquer questões oriundas do presente contrato, com renúncia expressa a qualquer 
                outro, por mais privilegiado que seja.
              </p>
            </section>

            {/* Assinatura */}
            <div className="border-t-2 border-gray-300 pt-8 mt-12">
              <p className="text-gray-600 text-center mb-4">
                <strong>Goiânia/GO</strong>, versão atualizada em <strong>março de 2026</strong>.
              </p>
              <div className="text-center">
                <p className="font-bold text-gray-900 mb-1">ArztWeg Company - O Caminho Médico</p>
                <p className="text-gray-700 mb-1">Sênior Developer - InternosMED BR</p>
                <p className="text-gray-600 text-sm">OAB 17.990</p>
              </div>
              <div className="bg-teal-50 border-2 border-teal-600 rounded-lg p-4 mt-6 text-center">
                <p className="text-gray-800 font-semibold">
                  — Aceite eletrônico mediante cadastro na plataforma —
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  O USUÁRIO declara ciência e concordância integral com os termos acima ao 
                  efetuar seu cadastro na plataforma InternosMed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
