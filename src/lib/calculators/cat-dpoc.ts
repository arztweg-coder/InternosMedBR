/**
 * cat-dpoc.ts — CAT: COPD Assessment Test
 * 🫁 Pneumologia — Impacto da DPOC na qualidade de vida
 */

import { Calculator, CalculatorResult } from './types';

export const CAT_DPOC: Calculator = {
  id: 'cat-dpoc',
  name: 'CAT — COPD Assessment Test',
  specialty: 'Pneumologia',
  emoji: '🫁',
  description: 'COPD Assessment Test (CAT) para avaliação do impacto da DPOC na qualidade de vida do paciente. Questionário de 8 itens validado pela GOLD para monitoramento longitudinal e decisão terapêutica. Complementa a espirometria na classificação GOLD ABCD.',
  tooltip: 'Pontuação 0-40. <10: baixo impacto. 10-20: médio impacto. 21-30: alto impacto. >30: muito alto. Junto com exacerbações, define categorias GOLD B (≥10) e A (<10) para tratamento.',
  category: 'questionnaire',
  fields: [
    { id: 'tosse', label: '1. Tosse — nunca tusso (0) até tusso o tempo todo (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'catarro', label: '2. Catarro — não tenho nenhum (0) até totalmente cheio (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'peito', label: '3. Aperto no peito — não tenho (0) até sensação muito forte (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'dispneia', label: '4. Falta de ar subindo escadas — sem falta (0) até muito ofegante (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'atividades', label: '5. Atividades domésticas — sem limitação (0) até muito limitado (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'sair', label: '6. Confiança para sair de casa — muita confiança (0) até sem confiança (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'sono', label: '7. Sono — durmo bem (0) até durmo muito mal (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
    { id: 'energia', label: '8. Energia — muita energia (0) até sem nenhuma energia (5)', type: 'radio', required: true, options: Array.from({length:6},(_,i)=>({value:i,label:String(i)})) },
  ],
  calculate: (values) => {
    const total = Object.values(values).reduce((s:number,v)=>s+Number(v),0);
    let category=''; let severity: CalculatorResult['severity']='low'; let recommendations:string[]=[];
    if(total<10){
      category='Baixo Impacto'; severity='low';
      recommendations=['Manter tratamento atual (LAMA/LABA se disponível)','Vacinação: influenza anual, pneumocócica','Cessação tabágica com suporte','Reabilitação pulmonar preventiva'];
    } else if(total<=20){
      category='Médio Impacto'; severity='moderate';
      recommendations=['LAMA ± LABA (GOLD B)','Avaliar reabilitação pulmonar (≥8 semanas)','Vacinação obrigatória','Monitoramento anual + espirometria'];
    } else if(total<=30){
      category='Alto Impacto'; severity='high';
      recommendations=['LAMA + LABA ± ICS (se exacerbações ou eosinofilia)','Reabilitação pulmonar intensiva','Oxigenoterapia se PaO₂ <55 mmHg','CPAP/VNI domiciliar se hipercapnia','Avaliar fenótipo (exacerbador, emphysema)'];
    } else {
      category='Impacto Muito Alto — DPOC Grave'; severity='critical';
      recommendations=['Otimização terapêutica URGENTE','Avaliação para transplante pulmonar','OCD 24h se Cr <55 mmHg ou SpO₂ <88%','VNI domiciliar se pCO₂ >50','Cuidados paliativos integrados'];
    }
    return { value:total, category, interpretation:`CAT: ${total}/40\nImpacto: ${category}`, severity, recommendations };
  },
  references: ['Jones PW, et al. Eur Respir J. 2009;34(3):648-54','GOLD 2024 Report. goldcopd.org'],
};

export const CAT_CALCULATORS: Calculator[] = [CAT_DPOC];
