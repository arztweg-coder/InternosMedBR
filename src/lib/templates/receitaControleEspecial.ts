/**
 * RECEITA DE CONTROLE ESPECIAL - Padrão ANVISA
 * Layout: A4 Landscape (Paisagem)
 * Formato: Conforme Portaria SVS/MS nº 344/1998
 * 
 * Baseado no modelo oficial fornecido por ArztWeg Company - O Caminho Médico
 * Substitui o padrão anterior do sistema InternosMed
 */

import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, 
         AlignmentType, VerticalAlign, WidthType, PageOrientation, BorderStyle } from 'docx';

export interface DadosReceitaControlada {
  // OBRIGATÓRIOS
  nomeProfissional: string;
  crm: string;
  nomePaciente: string;
  enderecoPaciente: string;
  medicamento: string;
  
  // OPCIONAIS (com padrões)
  dataEmissao?: string;
  nomeHospital?: string;
  cnpjHospital?: string;
  enderecoHospital?: string;
  enderecoProfissional?: string;
}

/**
 * Cria uma Receita de Controle Especial conforme padrão ANVISA
 * 
 * @param dados - Dados para preencher a receita
 * @returns Document - Documento DOCX pronto para download
 * 
 * @example
 * const dados = {
 *   nomeProfissional: 'Dr. João Silva',
 *   crm: 'GO-12345',
 *   nomePaciente: 'Maria Santos',
 *   enderecoPaciente: 'Rua Principal, 123 - Goiânia/GO',
 *   medicamento: 'METILFENIDATO 10mg\n\nUso: 1 cp pela manhã\nQuantidade: 30 comprimidos'
 * };
 * 
 * const doc = criarReceitaControleEspecial(dados);
 * const blob = await Packer.toBlob(doc);
 * saveAs(blob, 'receita_controle_especial.docx');
 */
export function criarReceitaControleEspecial(dados: DadosReceitaControlada): Document {
  
  // Valores padrão
  const DEFAULTS = {
    nomeHospital: 'HOSPITAL DAS CLÍNICAS – UFG',
    cnpjHospital: '01.567.601/0002-24',
    enderecoHospital: 'Primeira Avenida, S/N - Setor Leste Universitário, Goiânia - GO, 74605-020',
    dataEmissao: new Date().toLocaleDateString('pt-BR')
  };
  
  // Mesclar dados com padrões
  const d = {
    ...DEFAULTS,
    ...dados
  };
  
  /**
   * Função auxiliar para criar células da tabela
   */
  function cell(text: string, options: {
    bold?: boolean;
    size?: number;
    alignment?: AlignmentType;
    colspan?: number;
    rowspan?: number;
    verticalAlign?: VerticalAlign;
  } = {}): TableCell {
    
    const {
      bold = false,
      size = 11,
      alignment = AlignmentType.LEFT,
      colspan = 1,
      rowspan = 1,
      verticalAlign = VerticalAlign.CENTER
    } = options;
    
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              bold: bold,
              size: size * 2, // docx usa half-points
              font: 'Arial'
            })
          ],
          alignment: alignment,
        })
      ],
      columnSpan: colspan,
      rowSpan: rowspan,
      verticalAlign: verticalAlign,
      margins: {
        top: 50,
        bottom: 50,
        left: 100,
        right: 100,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      }
    });
  }
  
  /**
   * Função para criar linha vazia (espaçamento)
   */
  function emptyRow(cols: number = 20): TableRow {
    return new TableRow({
      children: Array(cols).fill(null).map(() => cell('', { size: 8 })),
      height: { value: 200, rule: 'exact' }
    });
  }
  
  // ══════════════════════════════════════════════════════════════
  // TABELA PRINCIPAL - 46 linhas x 20 colunas
  // ══════════════════════════════════════════════════════════════
  
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      
      // ═══ LINHA 1: TÍTULO ═══
      new TableRow({
        children: [
          cell('RECEITUÁRIO DE CONTROLE ESPECIAL', {
            bold: true,
            size: 14,
            alignment: AlignmentType.CENTER,
            colspan: 20
          })
        ],
        height: { value: 400, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 2: ESPAÇO ═══
      emptyRow(20),
      
      // ═══ LINHA 3: 1ª E 2ª VIA ═══
      new TableRow({
        children: [
          ...Array(10).fill(null).map(() => cell('', { size: 8 })),
          cell('1ª VIA: FARMÁCIA\n2ª VIA: PACIENTE', {
            size: 10,
            alignment: AlignmentType.CENTER,
            colspan: 6,
            bold: true
          }),
          ...Array(4).fill(null).map(() => cell('', { size: 8 }))
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 4: ESPAÇO ═══
      emptyRow(20),
      
      // ═══ LINHA 5: IDENTIFICAÇÃO DO EMITENTE ═══
      new TableRow({
        children: [
          cell('IDENTIFICAÇÃO DO EMITENTE', {
            size: 12,
            bold: true,
            alignment: AlignmentType.LEFT,
            colspan: 20
          })
        ],
        height: { value: 350, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 6: NOME DO PROFISSIONAL ═══
      new TableRow({
        children: [
          cell(`Nome do Profissional: ${d.nomeProfissional}`, {
            size: 11,
            colspan: 20
          })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 7: CRM ═══
      new TableRow({
        children: [
          cell(`CRM: ${d.crm}`, {
            size: 11,
            colspan: 10
          }),
          ...Array(10).fill(null).map(() => cell('', { size: 8 }))
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHAS 8-9: ESPAÇOS ═══
      emptyRow(20),
      emptyRow(20),
      
      // ═══ LINHA 10: HOSPITAL/INSTITUIÇÃO ═══
      new TableRow({
        children: [
          cell(`${d.nomeHospital}\nCNPJ: ${d.cnpjHospital}\n${d.enderecoHospital}`, {
            bold: true,
            size: 10,
            alignment: AlignmentType.CENTER,
            colspan: 20
          })
        ],
        height: { value: 500, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 11: ESPAÇO ═══
      emptyRow(20),
      
      // ═══ LINHA 12: PACIENTE ═══
      new TableRow({
        children: [
          cell('Paciente:', {
            size: 11,
            colspan: 4
          }),
          cell(d.nomePaciente, {
            size: 11,
            colspan: 16
          })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 13: ENDEREÇO DO PACIENTE ═══
      new TableRow({
        children: [
          cell('Endereço:', {
            size: 11,
            colspan: 4
          }),
          cell(d.enderecoPaciente, {
            size: 11,
            colspan: 16
          })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 14: PRESCRIÇÃO (LABEL) ═══
      new TableRow({
        children: [
          cell('Prescrição:', {
            size: 11,
            bold: true,
            colspan: 20
          })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHAS 15-18: ESPAÇO PARA MEDICAMENTO ═══
      new TableRow({
        children: [
          cell(d.medicamento, {
            size: 11,
            colspan: 20,
            alignment: AlignmentType.LEFT
          })
        ],
        height: { value: 800, rule: 'atLeast' }
      }),
      emptyRow(20),
      emptyRow(20),
      emptyRow(20),
      
      // ═══ LINHA 19: DATA E ASSINATURA DO PRESCRITOR ═══
      new TableRow({
        children: [
          cell(`${d.dataEmissao || '___/___/______'}`, {
            size: 11,
            alignment: AlignmentType.CENTER,
            colspan: 8
          }),
          cell('', { size: 8, colspan: 4 }),
          cell('_______________________________', {
            size: 11,
            alignment: AlignmentType.CENTER,
            colspan: 8
          })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      new TableRow({
        children: [
          cell('Data', {
            size: 9,
            alignment: AlignmentType.CENTER,
            colspan: 8
          }),
          cell('', { size: 8, colspan: 4 }),
          cell('Assinatura e Carimbo do Prescritor', {
            size: 9,
            alignment: AlignmentType.CENTER,
            colspan: 8
          })
        ],
        height: { value: 250, rule: 'atLeast' }
      }),
      
      // ═══ LINHAS 21-22: ESPAÇO ═══
      emptyRow(20),
      emptyRow(20),
      
      // ═══ LINHA 23: IDENTIFICAÇÃO DO COMPRADOR E FORNECEDOR ═══
      new TableRow({
        children: [
          cell('IDENTIFICAÇÃO DO COMPRADOR', {
            size: 11,
            bold: true,
            alignment: AlignmentType.CENTER,
            colspan: 10
          }),
          cell('IDENTIFICAÇÃO DO FORNECEDOR', {
            size: 11,
            bold: true,
            alignment: AlignmentType.CENTER,
            colspan: 10
          })
        ],
        height: { value: 350, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 24: NOME ═══
      new TableRow({
        children: [
          cell('Nome:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 8 }),
          cell('Nome:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 8 })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 25: RG ═══
      new TableRow({
        children: [
          cell('RG nº:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 4 }),
          cell('Órg. Em.:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 10 })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 26: ENDEREÇO ═══
      new TableRow({
        children: [
          cell('Endereço:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 8 }),
          cell('Endereço:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 8 })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 27: CIDADE E UF ═══
      new TableRow({
        children: [
          cell('Cidade:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 5 }),
          cell('UF:', { size: 10, colspan: 1 }),
          cell('', { size: 10, colspan: 2 }),
          cell('Data:', { size: 10, colspan: 2 }),
          cell('___/___/___', { size: 10, colspan: 8 })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHA 28: TELEFONE ═══
      new TableRow({
        children: [
          cell('Telefone:', { size: 10, colspan: 2 }),
          cell('', { size: 10, colspan: 8 }),
          cell('', { size: 10, colspan: 10 })
        ],
        height: { value: 300, rule: 'atLeast' }
      }),
      
      // ═══ LINHAS 29-30: ASSINATURAS ═══
      new TableRow({
        children: [
          cell('', { size: 10, colspan: 10 }),
          cell('', { size: 10, colspan: 10 })
        ],
        height: { value: 400, rule: 'atLeast' }
      }),
      
      new TableRow({
        children: [
          cell('Assinatura do Comprador', {
            size: 10,
            alignment: AlignmentType.CENTER,
            colspan: 10
          }),
          cell('Assinatura do Farmacêutico\nCarimbo da Farmácia', {
            size: 10,
            alignment: AlignmentType.CENTER,
            colspan: 10
          })
        ],
        height: { value: 400, rule: 'atLeast' }
      }),
      
    ]
  });
  
  // ══════════════════════════════════════════════════════════════
  // CRIAR DOCUMENTO EM LANDSCAPE
  // ══════════════════════════════════════════════════════════════
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
            width: 16838,  // A4 Landscape width (11.69 inches)
            height: 11906  // A4 Landscape height (8.27 inches)
          },
          margin: {
            top: 720,     // 0.5 inch
            right: 720,
            bottom: 720,
            left: 720
          }
        }
      },
      children: [table]
    }]
  });
  
  return doc;
}

/**
 * Função auxiliar para download do documento
 * 
 * @param dados - Dados da receita
 * @param nomeArquivo - Nome do arquivo (padrão: 'receita_controle_especial.docx')
 * 
 * @example
 * await downloadReceitaControleEspecial(dados, 'receita_metilfenidato.docx');
 */
export async function downloadReceitaControleEspecial(
  dados: DadosReceitaControlada,
  nomeArquivo: string = 'receita_controle_especial.docx'
): Promise<void> {
  const doc = criarReceitaControleEspecial(dados);
  const blob = await Packer.toBlob(doc);
  
  // Criar link de download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
