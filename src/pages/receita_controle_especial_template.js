/**
 * TEMPLATE: RECEITA DE CONTROLE ESPECIAL
 * Layout: A4 Landscape (Paisagem)
 * Baseado no modelo oficial fornecido por Dr. Frank Walczak
 * 
 * Este template substitui o padrão anterior do sistema.
 */

const { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun,
        AlignmentType, VerticalAlign, BorderStyle, WidthType, PageOrientation } = require('docx');
const fs = require('fs');

/**
 * Cria uma receita de controle especial conforme padrão ANVISA
 * 
 * @param {Object} dados - Dados para preencher a receita
 * @param {string} dados.nomeProfissional - Nome completo do médico
 * @param {string} dados.crm - CRM do médico (ex: "GO-12345")
 * @param {string} dados.enderecoProfissional - Endereço do consultório
 * @param {string} dados.nomePaciente - Nome completo do paciente
 * @param {string} dados.enderecoPaciente - Endereço do paciente
 * @param {string} dados.medicamento - Prescrição (medicamento, dosagem, uso)
 * @param {string} dados.dataEmissao - Data de emissão (ex: "12/04/2026")
 * @param {string} dados.nomeHospital - Nome da instituição (padrão: HC-UFG)
 * @param {string} dados.cnpjHospital - CNPJ da instituição
 * @param {string} dados.enderecoHospital - Endereço completo da instituição
 */
function criarReceitaControleEspecial(dados) {
    
    // Função auxiliar para criar células mescladas
    function cell(text, options = {}) {
        const {
            bold = false,
            size = 11,
            alignment = AlignmentType.LEFT,
            colspan = 1,
            rowspan = 1,
            borders = {},
            shading = {},
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
                        })
                    ],
                    alignment: alignment,
                })
            ],
            columnSpan: colspan,
            rowSpan: rowspan,
            borders: borders,
            shading: shading,
            verticalAlign: verticalAlign,
            margins: {
                top: 50,
                bottom: 50,
                left: 100,
                right: 100,
            }
        });
    }

    // Função para criar linha vazia
    function emptyRow(cols = 20) {
        return new TableRow({
            children: Array(cols).fill(null).map(() => 
                cell('', { size: 8 })
            ),
            height: { value: 200, rule: 'exact' }
        });
    }

    // Tabela principal com 20 colunas
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

            // ═══ LINHA 2: VAZIA ═══
            emptyRow(20),

            // ═══ LINHA 3: 1ª E 2ª VIA ═══
            new TableRow({
                children: [
                    ...Array(10).fill(null).map(() => cell('', { size: 8 })),
                    cell('1ª VIA: FARMÁCIA \n2ª VIA: PACIENTE', {
                        size: 10,
                        alignment: AlignmentType.CENTER,
                        colspan: 6
                    }),
                    ...Array(4).fill(null).map(() => cell('', { size: 8 }))
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHA 4: VAZIA ═══
            emptyRow(20),

            // ═══ LINHA 5: IDENTIFICAÇÃO DO EMITENTE ═══
            new TableRow({
                children: [
                    cell('IDENTIFICAÇÃO DO EMITENTE', {
                        size: 14,
                        alignment: AlignmentType.LEFT,
                        colspan: 20
                    })
                ],
                height: { value: 350, rule: 'atLeast' }
            }),

            // ═══ LINHA 6: NOME DO PROFISSIONAL ═══
            new TableRow({
                children: [
                    cell(`Nome do Profissional: ${dados.nomeProfissional || ''}`, {
                        size: 11,
                        colspan: 10
                    }),
                    ...Array(10).fill(null).map(() => cell('', { size: 8 }))
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHA 7: CRM ═══
            new TableRow({
                children: [
                    cell(`CRM: ${dados.crm || ''}`, {
                        size: 11,
                        colspan: 2
                    }),
                    ...Array(18).fill(null).map(() => cell('', { size: 8 }))
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHAS 8-9: VAZIAS ═══
            emptyRow(20),
            emptyRow(20),

            // ═══ LINHA 10: HOSPITAL ═══
            new TableRow({
                children: [
                    cell(`${dados.nomeHospital || 'HOSPITAL DAS CLÍNICAS – UFG'} \nCNPJ: ${dados.cnpjHospital || '01.567.601/0002-24'}. ${dados.enderecoHospital || 'Primeira Avenida, S/N - Setor Leste Universitário, Goiânia - GO, 74605-020'}`, {
                        bold: true,
                        size: 10,
                        alignment: AlignmentType.CENTER,
                        colspan: 20
                    })
                ],
                height: { value: 500, rule: 'atLeast' }
            }),

            // ═══ LINHA 11: VAZIA ═══
            emptyRow(20),

            // ═══ LINHA 12: PACIENTE ═══
            new TableRow({
                children: [
                    cell('Paciente:', {
                        size: 11,
                        colspan: 6
                    }),
                    cell(dados.nomePaciente || '', {
                        size: 11,
                        colspan: 14
                    })
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHA 13: ENDEREÇO DO PACIENTE ═══
            new TableRow({
                children: [
                    cell('Endereço:', {
                        size: 11,
                        colspan: 7
                    }),
                    cell(dados.enderecoPaciente || '', {
                        size: 11,
                        colspan: 13
                    })
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHA 14: PRESCRIÇÃO ═══
            new TableRow({
                children: [
                    cell('Prescrição:', {
                        size: 11,
                        colspan: 8
                    }),
                    ...Array(12).fill(null).map(() => cell('', { size: 8 }))
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // ═══ LINHAS 15-16: ESPAÇO PARA MEDICAMENTO ═══
            new TableRow({
                children: [
                    cell(dados.medicamento || '', {
                        size: 11,
                        colspan: 20
                    })
                ],
                height: { value: 600, rule: 'atLeast' }
            }),
            emptyRow(20),

            // ═══ LINHA 17: IDENTIFICAÇÃO COMPRADOR/FORNECEDOR ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('IDENTIFICAÇÃO DO COMPRADOR', {
                        size: 10,
                        alignment: AlignmentType.CENTER,
                        colspan: 13
                    }),
                    cell('', { size: 8 }),
                    cell('IDENTIFICAÇÃO DO FORNECEDOR', {
                        size: 10,
                        alignment: AlignmentType.CENTER,
                        colspan: 4
                    }),
                    cell('', { size: 8 })
                ],
                height: { value: 350, rule: 'atLeast' }
            }),

            // ═══ LINHA 18: NOME ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('Nome:', {
                        size: 7,
                        colspan: 2
                    }),
                    ...Array(17).fill(null).map(() => cell('', { size: 8 }))
                ],
                height: { value: 250, rule: 'atLeast' }
            }),

            // ═══ LINHA 19: RG e ÓRG. EMISSOR ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('RG nº:', {
                        size: 7,
                        colspan: 2
                    }),
                    ...Array(6).fill(null).map(() => cell('', { size: 8 })),
                    cell('Órg. Em.:', {
                        size: 7,
                        colspan: 3
                    }),
                    ...Array(6).fill(null).map(() => cell('', { size: 8 })),
                    cell('  /     /', {
                        size: 7
                    })
                ],
                height: { value: 250, rule: 'atLeast' }
            }),

            // ═══ LINHA 20: ENDEREÇO E ASSINATURAS ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('Endereço:', {
                        size: 7,
                        colspan: 4
                    }),
                    ...Array(10).fill(null).map(() => cell('', { size: 8 })),
                    cell('Assinatura do Farmacêutico', {
                        size: 7,
                        alignment: AlignmentType.CENTER,
                        colspan: 2,
                        rowspan: 2
                    }),
                    cell('', { size: 8 }),
                    cell('Data', {
                        size: 7,
                        alignment: AlignmentType.CENTER,
                        rowspan: 2
                    })
                ],
                height: { value: 250, rule: 'atLeast' }
            }),

            // ═══ LINHA 21: CIDADE ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('Cidade:', {
                        size: 7,
                        colspan: 3
                    }),
                    ...Array(9).fill(null).map(() => cell('', { size: 8 })),
                    cell('UF:', {
                        size: 7,
                        colspan: 2
                    }),
                    cell('', { size: 8 }),
                    // Células mescladas da linha anterior (assinatura e data)
                    cell('', { size: 8 })
                ],
                height: { value: 250, rule: 'atLeast' }
            }),

            // ═══ LINHA 22: TELEFONE ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('Telefone:', {
                        size: 7,
                        colspan: 4
                    }),
                    ...Array(11).fill(null).map(() => cell('', { size: 8 })),
                    cell('Carimbo da Farmácia', {
                        size: 7,
                        alignment: AlignmentType.CENTER,
                        colspan: 3,
                        rowspan: 3
                    }),
                    cell('', { size: 8 })
                ],
                height: { value: 250, rule: 'atLeast' }
            }),

            // ═══ LINHAS 23-24: ASSINATURA DO COMPRADOR ═══
            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    cell('Assinatura do Comprador', {
                        size: 7,
                        alignment: AlignmentType.CENTER,
                        colspan: 13,
                        rowspan: 2
                    }),
                    cell('', { size: 8 }),
                    // Célula mesclada do carimbo
                    cell('', { size: 8 })
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            new TableRow({
                children: [
                    cell('', { size: 8 }),
                    // Célula mesclada da assinatura
                    cell('', { size: 8 }),
                    // Célula mesclada do carimbo
                    cell('', { size: 8 })
                ],
                height: { value: 300, rule: 'atLeast' }
            }),

            // Linhas adicionais até completar 46 linhas (estrutura da 2ª via espelhada)
            // ... [continua com mesma estrutura]

        ]
    });

    // Criar documento em landscape
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                        width: 16838, // A4 Landscape width in DXA (11.69")
                        height: 11906 // A4 Landscape height in DXA (8.27")
                    },
                    margin: {
                        top: 720,    // 0.5 inch
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

// ═══ EXEMPLO DE USO ═══
const dadosReceita = {
    nomeProfissional: 'Dr. Fulano de Tal',
    crm: 'GO-12345',
    enderecoProfissional: 'Rua Exemplo, 123 - Goiânia/GO',
    nomePaciente: 'João da Silva',
    enderecoPaciente: 'Av. Principal, 456 - Setor Central',
    medicamento: 'METILFENIDATO 10mg\n\nUso: 1 comprimido pela manhã\nQuantidade: 30 comprimidos',
    dataEmissao: '12/04/2026',
    nomeHospital: 'HOSPITAL DAS CLÍNICAS – UFG',
    cnpjHospital: '01.567.601/0002-24',
    enderecoHospital: 'Primeira Avenida, S/N - Setor Leste Universitário, Goiânia - GO, 74605-020'
};

const doc = criarReceitaControleEspecial(dadosReceita);

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync('receita_controle_especial.docx', buffer);
    console.log('✅ Receita de Controle Especial gerada com sucesso!');
    console.log('📄 Arquivo: receita_controle_especial.docx');
}).catch(error => {
    console.error('❌ Erro ao gerar receita:', error);
});
