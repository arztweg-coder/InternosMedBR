/**
 * Lista de ~200 medicamentos comuns do SUS (nome genérico + nomes comerciais)
 * Formato: { generic: string, commercial: string[], class: string }
 */

export interface Medication {
  generic: string;
  commercial: string[];
  class: string;
  presentations?: string[];
}

export const MEDICATIONS: Medication[] = [
  // Analgésicos / Antitérmicos
  { generic: "Dipirona sódica", commercial: ["Novalgina", "Anador", "Magnopyrol"], class: "Analgésico / Antitérmico", presentations: ["500mg cp", "500mg/ml gotas", "1g/2ml amp"] },
  { generic: "Paracetamol", commercial: ["Tylenol", "Dôrico", "Neopiridin"], class: "Analgésico / Antitérmico", presentations: ["500mg cp", "750mg cp", "200mg/ml gotas"] },
  { generic: "Ácido acetilsalicílico", commercial: ["AAS", "Aspirina", "Bufferin"], class: "Analgésico / Anti-inflamatório / Antiagregante", presentations: ["100mg cp", "500mg cp"] },
  { generic: "Tramadol", commercial: ["Tramal", "Ultram"], class: "Opioide / Analgésico", presentations: ["50mg cp", "100mg/2ml amp"] },
  { generic: "Morfina", commercial: ["Dimorf", "MS Contin"], class: "Opioide forte", presentations: ["10mg/ml amp", "30mg cp"] },
  { generic: "Codeína", commercial: ["Tylex", "Codein"], class: "Opioide leve", presentations: ["30mg cp"] },

  // Anti-inflamatórios
  { generic: "Ibuprofeno", commercial: ["Advil", "Motrin", "Alivium"], class: "AINE", presentations: ["400mg cp", "600mg cp", "50mg/ml gotas"] },
  { generic: "Naproxeno", commercial: ["Flanax", "Naprosyn"], class: "AINE", presentations: ["250mg cp", "500mg cp"] },
  { generic: "Diclofenaco de potássio", commercial: ["Cataflam", "Biofenac"], class: "AINE", presentations: ["50mg cp"] },
  { generic: "Diclofenaco de sódio", commercial: ["Voltaren", "Diclofenaco"], class: "AINE", presentations: ["50mg cp", "75mg/3ml amp"] },
  { generic: "Cetoprofeno", commercial: ["Profenid", "Artrose"], class: "AINE", presentations: ["100mg cp", "100mg/2ml amp"] },
  { generic: "Meloxicam", commercial: ["Movatec", "Mobic"], class: "AINE seletivo", presentations: ["7,5mg cp", "15mg cp"] },
  { generic: "Celecoxibe", commercial: ["Celebra", "Celcoxx"], class: "AINE seletivo (COX-2)", presentations: ["100mg cp", "200mg cp"] },
  { generic: "Nimesulida", commercial: ["Nisulid", "Scaflan"], class: "AINE seletivo", presentations: ["100mg cp"] },
  { generic: "Tenoxicam", commercial: ["Tilatil", "Tenoxil"], class: "AINE", presentations: ["20mg amp", "20mg cp"] },

  // Corticoides
  { generic: "Prednisona", commercial: ["Meticorten", "Prednosol"], class: "Corticoide oral", presentations: ["5mg cp", "20mg cp"] },
  { generic: "Prednisolona", commercial: ["Predsim", "Predsolon"], class: "Corticoide oral", presentations: ["3mg/ml xarope", "5mg cp"] },
  { generic: "Dexametasona", commercial: ["Decadron", "Dexason"], class: "Corticoide", presentations: ["4mg/ml amp", "4mg cp", "0,1% creme"] },
  { generic: "Hidrocortisona", commercial: ["Solu-Cortef", "Flebocortid"], class: "Corticoide EV", presentations: ["100mg amp", "500mg amp"] },
  { generic: "Metilprednisolona", commercial: ["Solu-Medrol", "Depo-Medrol"], class: "Corticoide EV", presentations: ["500mg amp", "1g amp"] },
  { generic: "Betametasona", commercial: ["Celestone", "Diprostene"], class: "Corticoide", presentations: ["4mg/ml amp", "0,1% creme"] },

  // Antibióticos – Penicilinas
  { generic: "Amoxicilina", commercial: ["Amoxil", "Novamox"], class: "Antibiótico – Penicilina", presentations: ["500mg cp", "875mg cp", "50mg/ml xarope"] },
  { generic: "Amoxicilina + Clavulanato", commercial: ["Clavulin", "Augmentin"], class: "Antibiótico – Penicilina / Inibidor β-lactamase", presentations: ["500+125mg cp", "875+125mg cp"] },
  { generic: "Ampicilina", commercial: ["Binotal", "Ampiclin"], class: "Antibiótico – Penicilina", presentations: ["500mg cp", "1g amp"] },
  { generic: "Ampicilina + Sulbactam", commercial: ["Unasyn", "Ampictam"], class: "Antibiótico – Penicilina", presentations: ["1,5g amp", "3g amp"] },
  { generic: "Penicilina G benzatina", commercial: ["Benzetacil", "Longacillin"], class: "Antibiótico – Penicilina", presentations: ["1.200.000 UI amp", "2.400.000 UI amp"] },
  { generic: "Oxacilina", commercial: ["Estafilim", "Oxacil"], class: "Antibiótico – Penicilina resistente à penicilase", presentations: ["500mg amp", "1g amp"] },
  { generic: "Piperacilina + Tazobactam", commercial: ["Tazocin", "Pipetaz"], class: "Antibiótico – Penicilina de amplo espectro", presentations: ["4,5g amp"] },

  // Antibióticos – Cefalosporinas
  { generic: "Cefalexina", commercial: ["Keflex", "Cepamed"], class: "Antibiótico – Cefalosporina 1ª geração", presentations: ["500mg cp", "250mg/5ml xarope"] },
  { generic: "Cefadroxila", commercial: ["Cefamox", "Droxil"], class: "Antibiótico – Cefalosporina 1ª geração", presentations: ["500mg cp", "50mg/ml xarope"] },
  { generic: "Cefazolina", commercial: ["Kefazol", "Cefazolin"], class: "Antibiótico – Cefalosporina 1ª geração EV", presentations: ["1g amp", "2g amp"] },
  { generic: "Cefuroxima", commercial: ["Zinacef", "Ceftin"], class: "Antibiótico – Cefalosporina 2ª geração", presentations: ["500mg cp", "750mg amp"] },
  { generic: "Ceftriaxona", commercial: ["Rocefin", "Triaxin"], class: "Antibiótico – Cefalosporina 3ª geração", presentations: ["1g amp", "2g amp"] },
  { generic: "Cefotaxima", commercial: ["Claforan", "Cefotax"], class: "Antibiótico – Cefalosporina 3ª geração", presentations: ["1g amp", "2g amp"] },
  { generic: "Cefepima", commercial: ["Maxcef", "Cepim"], class: "Antibiótico – Cefalosporina 4ª geração", presentations: ["1g amp", "2g amp"] },
  { generic: "Ceftazidima", commercial: ["Fortaz", "Tazicel"], class: "Antibiótico – Cefalosporina 3ª geração (pseudomonas)", presentations: ["1g amp", "2g amp"] },

  // Antibióticos – Carbapenêmicos / outros β-lactâmicos
  { generic: "Meropeném", commercial: ["Meronem", "Merotec"], class: "Antibiótico – Carbapenêmico", presentations: ["500mg amp", "1g amp"] },
  { generic: "Imipeném + Cilastatina", commercial: ["Tienam", "Impem"], class: "Antibiótico – Carbapenêmico", presentations: ["500mg amp"] },
  { generic: "Ertapeném", commercial: ["Invanz", "Ertazon"], class: "Antibiótico – Carbapenêmico", presentations: ["1g amp"] },

  // Antibióticos – Macrolídeos
  { generic: "Azitromicina", commercial: ["Zithromax", "Azi-Once", "Azitren"], class: "Antibiótico – Macrolídeo", presentations: ["500mg cp", "500mg amp"] },
  { generic: "Claritromicina", commercial: ["Klaricid", "Zeclar"], class: "Antibiótico – Macrolídeo", presentations: ["500mg cp", "500mg amp"] },
  { generic: "Eritromicina", commercial: ["Pantomicina", "Ilosone"], class: "Antibiótico – Macrolídeo", presentations: ["500mg cp"] },

  // Antibióticos – Quinolonas
  { generic: "Ciprofloxacino", commercial: ["Cipro", "Ciproflox"], class: "Antibiótico – Fluoroquinolona", presentations: ["500mg cp", "200mg/100ml EV"] },
  { generic: "Levofloxacino", commercial: ["Levaquin", "Tavanic"], class: "Antibiótico – Fluoroquinolona", presentations: ["500mg cp", "500mg/100ml EV"] },
  { generic: "Moxifloxacino", commercial: ["Avelox", "Moxicin"], class: "Antibiótico – Fluoroquinolona", presentations: ["400mg cp", "400mg/250ml EV"] },
  { generic: "Norfloxacino", commercial: ["Floxacin", "Norflox"], class: "Antibiótico – Fluoroquinolona", presentations: ["400mg cp"] },

  // Antibióticos – Outros
  { generic: "Metronidazol", commercial: ["Flagyl", "Metronix"], class: "Antibiótico – Nitroimidazol", presentations: ["250mg cp", "400mg cp", "500mg/100ml EV"] },
  { generic: "Clindamicina", commercial: ["Dalacin", "Clindal"], class: "Antibiótico – Lincosamida", presentations: ["300mg cp", "600mg/4ml amp"] },
  { generic: "Vancomicina", commercial: ["Vancocin", "Vancon"], class: "Antibiótico – Glicopeptídeo", presentations: ["500mg amp", "1g amp"] },
  { generic: "Sulfametoxazol + Trimetoprima", commercial: ["Bactrim", "Septra", "Infatrim"], class: "Antibiótico – Sulfonamida", presentations: ["400+80mg cp", "800+160mg cp"] },
  { generic: "Doxiciclina", commercial: ["Vibramicina", "Doxifarm"], class: "Antibiótico – Tetraciclina", presentations: ["100mg cp"] },
  { generic: "Rifampicina", commercial: ["Rifadin", "Rimactan"], class: "Antituberculoso / Antibiótico", presentations: ["300mg cp", "600mg cp"] },
  { generic: "Isoniazida", commercial: ["Hidrazida", "INH"], class: "Antituberculoso", presentations: ["100mg cp", "300mg cp"] },
  { generic: "Etambutol", commercial: ["Myambutol", "Etambutol"], class: "Antituberculoso", presentations: ["400mg cp"] },
  { generic: "Pirazinamida", commercial: ["Pebeze", "Piraldina"], class: "Antituberculoso", presentations: ["500mg cp"] },
  { generic: "Nitrofurantoína", commercial: ["Macrodantina", "Macrobid"], class: "Antibiótico urinário", presentations: ["50mg cp", "100mg cp"] },
  { generic: "Fosfomicina", commercial: ["Monuril", "Fosfocin"], class: "Antibiótico urinário", presentations: ["3g sachê"] },
  { generic: "Linezolida", commercial: ["Zyvox", "Lydolin"], class: "Antibiótico – Oxazolidinona", presentations: ["600mg cp", "600mg/300ml EV"] },

  // Antifúngicos
  { generic: "Fluconazol", commercial: ["Zoltec", "Diflucan"], class: "Antifúngico – Azol", presentations: ["150mg cp", "200mg cp", "200mg/100ml EV"] },
  { generic: "Itraconazol", commercial: ["Sporanox", "Itranax"], class: "Antifúngico – Azol", presentations: ["100mg cp"] },
  { generic: "Nistatina", commercial: ["Micostatin", "Nistatin"], class: "Antifúngico tópico / oral", presentations: ["100.000 UI/ml susp", "100.000 UI comprimido vaginal"] },
  { generic: "Anfotericina B", commercial: ["Fungizon", "Abelcet"], class: "Antifúngico sistêmico", presentations: ["50mg amp"] },

  // Antivirais
  { generic: "Aciclovir", commercial: ["Zovirax", "Hervirax"], class: "Antiviral – Herpesviridae", presentations: ["200mg cp", "400mg cp", "250mg amp"] },
  { generic: "Oseltamivir", commercial: ["Tamiflu", "Influflux"], class: "Antiviral – Influenza", presentations: ["75mg cp"] },

  // Antiparasitários
  { generic: "Albendazol", commercial: ["Zentel", "Albentel"], class: "Anti-helmíntico", presentations: ["400mg cp", "40mg/ml susp"] },
  { generic: "Mebendazol", commercial: ["Pantelmin", "Vermox"], class: "Anti-helmíntico", presentations: ["100mg cp", "20mg/ml susp"] },
  { generic: "Ivermectina", commercial: ["Revectina", "Stromectol"], class: "Antiparasitário", presentations: ["6mg cp"] },
  { generic: "Metronidazol (anti-parasitário)", commercial: ["Flagyl", "Metronix"], class: "Antiparasitário – Giárdia/Ameba", presentations: ["250mg cp", "400mg cp"] },

  // Sistema Cardiovascular – Anti-hipertensivos
  { generic: "Enalapril", commercial: ["Vasotec", "Renitec", "Enalatec"], class: "IECA – Anti-hipertensivo", presentations: ["5mg cp", "10mg cp", "20mg cp"] },
  { generic: "Losartana potássica", commercial: ["Cozaar", "Aradois"], class: "BRA – Anti-hipertensivo", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Valsartana", commercial: ["Diovan", "Valsartec"], class: "BRA – Anti-hipertensivo", presentations: ["80mg cp", "160mg cp"] },
  { generic: "Anlodipino", commercial: ["Norvasc", "Pressat"], class: "BCC – Anti-hipertensivo", presentations: ["5mg cp", "10mg cp"] },
  { generic: "Nifedipino", commercial: ["Adalat", "Nifecard"], class: "BCC – Anti-hipertensivo", presentations: ["10mg cp", "20mg cp", "30mg cp LA"] },
  { generic: "Hidroclorotiazida", commercial: ["Clorana", "Higroton"], class: "Diurético tiazídico", presentations: ["12,5mg cp", "25mg cp"] },
  { generic: "Furosemida", commercial: ["Lasix", "Furosemix"], class: "Diurético de alça", presentations: ["40mg cp", "20mg/2ml amp"] },
  { generic: "Espironolactona", commercial: ["Aldactone", "Spirolona"], class: "Diurético poupador de potássio", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Propranolol", commercial: ["Inderal", "Propranolol"], class: "Beta-bloqueador não seletivo", presentations: ["10mg cp", "40mg cp", "80mg cp"] },
  { generic: "Atenolol", commercial: ["Tenormin", "Atenol"], class: "Beta-bloqueador β1 seletivo", presentations: ["25mg cp", "50mg cp"] },
  { generic: "Metoprolol", commercial: ["Seloken", "Lopressor"], class: "Beta-bloqueador β1 seletivo", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Carvedilol", commercial: ["Coreg", "Dilatrend"], class: "Beta-bloqueador não seletivo / alfa", presentations: ["3,125mg cp", "6,25mg cp", "12,5mg cp", "25mg cp"] },
  { generic: "Bisoprolol", commercial: ["Concor", "Bisobloc"], class: "Beta-bloqueador β1 seletivo", presentations: ["2,5mg cp", "5mg cp", "10mg cp"] },
  { generic: "Captopril", commercial: ["Capoten", "Captomed"], class: "IECA – Anti-hipertensivo", presentations: ["12,5mg cp", "25mg cp", "50mg cp"] },
  { generic: "Ramipril", commercial: ["Altace", "Naprix"], class: "IECA – Anti-hipertensivo", presentations: ["2,5mg cp", "5mg cp", "10mg cp"] },
  { generic: "Clonidina", commercial: ["Atensina", "Catapress"], class: "Agonista alfa-2 – Anti-hipertensivo", presentations: ["0,1mg cp", "0,15mg cp", "0,3mg/ml amp"] },
  { generic: "Hidralazina", commercial: ["Apresolina", "Hydralazine"], class: "Vasodilatador direto", presentations: ["25mg cp", "50mg cp", "20mg amp"] },
  { generic: "Nitroprusseto de sódio", commercial: ["Nipride", "Nitroprusside"], class: "Vasodilatador – Emergência hipertensiva", presentations: ["50mg amp"] },

  // Sistema Cardiovascular – Outros
  { generic: "Digoxina", commercial: ["Lanoxin", "Digocin"], class: "Glicosídeo cardíaco", presentations: ["0,25mg cp", "0,25mg/ml amp"] },
  { generic: "Amiodarona", commercial: ["Ancoron", "Cordarone"], class: "Antiarrítmico", presentations: ["200mg cp", "50mg/ml amp"] },
  { generic: "Atorvastatina", commercial: ["Lipitor", "Citalor"], class: "Hipolipemiante – Estatina", presentations: ["10mg cp", "20mg cp", "40mg cp", "80mg cp"] },
  { generic: "Sinvastatina", commercial: ["Zocor", "Sinvax"], class: "Hipolipemiante – Estatina", presentations: ["10mg cp", "20mg cp", "40mg cp"] },
  { generic: "Rosuvastatina", commercial: ["Crestor", "Rosuton"], class: "Hipolipemiante – Estatina", presentations: ["10mg cp", "20mg cp", "40mg cp"] },
  { generic: "Varfarina", commercial: ["Marevan", "Coumadin"], class: "Anticoagulante oral – Antagonista vitamina K", presentations: ["1mg cp", "5mg cp"] },
  { generic: "Rivaroxabana", commercial: ["Xarelto", "Rivaroban"], class: "Anticoagulante oral – Anti-Xa", presentations: ["10mg cp", "15mg cp", "20mg cp"] },
  { generic: "Apixabana", commercial: ["Eliquis", "Apixamax"], class: "Anticoagulante oral – Anti-Xa", presentations: ["2,5mg cp", "5mg cp"] },
  { generic: "Enoxaparina", commercial: ["Clexane", "Hepaxane"], class: "Anticoagulante – HBPM", presentations: ["20mg/0,2ml", "40mg/0,4ml", "60mg/0,6ml", "80mg/0,8ml"] },
  { generic: "Heparina sódica", commercial: ["Heparin", "Liquemine"], class: "Anticoagulante – HNF EV", presentations: ["5.000 UI/ml amp"] },
  { generic: "Clopidogrel", commercial: ["Plavix", "Plavirel"], class: "Antiagregante plaquetário", presentations: ["75mg cp"] },

  // Sistema Endócrino – Diabetes
  { generic: "Metformina", commercial: ["Glifage", "Dimefor"], class: "Antidiabético oral – Biguanida", presentations: ["500mg cp", "850mg cp", "1g cp"] },
  { generic: "Glibenclamida", commercial: ["Daonil", "Euglucon"], class: "Antidiabético oral – Sulfonilureia", presentations: ["2,5mg cp", "5mg cp"] },
  { generic: "Glicazida", commercial: ["Diamicron", "Azukon MR"], class: "Antidiabético oral – Sulfonilureia", presentations: ["30mg cp MR", "60mg cp MR"] },
  { generic: "Sitagliptina", commercial: ["Januvia", "Sitaglip"], class: "Antidiabético oral – iDPP-4", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Empagliflozina", commercial: ["Jardiance", "Empa"], class: "Antidiabético oral – iSGLT-2", presentations: ["10mg cp", "25mg cp"] },
  { generic: "Dapagliflozina", commercial: ["Forxiga", "Farxiga"], class: "Antidiabético oral – iSGLT-2", presentations: ["10mg cp"] },
  { generic: "Insulina NPH", commercial: ["Humulin N", "Insulatard"], class: "Insulina de ação intermediária", presentations: ["100 UI/ml (10ml)", "100 UI/ml caneta"] },
  { generic: "Insulina Regular", commercial: ["Humulin R", "Actrapid"], class: "Insulina de ação rápida", presentations: ["100 UI/ml (10ml)"] },
  { generic: "Insulina Glargina", commercial: ["Lantus", "Basaglar"], class: "Insulina de ação prolongada", presentations: ["100 UI/ml caneta"] },
  { generic: "Insulina Lispro", commercial: ["Humalog", "Lisprolin"], class: "Insulina ultrarrápida", presentations: ["100 UI/ml caneta"] },

  // Sistema Endócrino – Tireoide
  { generic: "Levotiroxina sódica", commercial: ["Puran T4", "Euthyrox"], class: "Hormônio tireoidiano", presentations: ["25mcg cp", "50mcg cp", "75mcg cp", "100mcg cp"] },
  { generic: "Metimazol", commercial: ["Tapazol", "Thyrozol"], class: "Antitireoidiano", presentations: ["5mg cp", "10mg cp"] },
  { generic: "Propiltiouracil", commercial: ["PTU", "Propil"], class: "Antitireoidiano", presentations: ["100mg cp"] },

  // Sistema Nervoso Central
  { generic: "Amitriptilina", commercial: ["Tryptanol", "Amytril"], class: "Antidepressivo tricíclico", presentations: ["10mg cp", "25mg cp"] },
  { generic: "Fluoxetina", commercial: ["Prozac", "Daforin", "Fluoxil"], class: "Antidepressivo – ISRS", presentations: ["20mg cp", "40mg cp"] },
  { generic: "Sertralina", commercial: ["Zoloft", "Assert"], class: "Antidepressivo – ISRS", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Escitalopram", commercial: ["Lexapro", "Exodus"], class: "Antidepressivo – ISRS", presentations: ["5mg cp", "10mg cp", "20mg cp"] },
  { generic: "Venlafaxina", commercial: ["Efexor", "Venlift"], class: "Antidepressivo – ISRSN", presentations: ["37,5mg cp", "75mg cp", "150mg cp"] },
  { generic: "Bupropiona", commercial: ["Wellbutrin", "Zyban", "Bup"], class: "Antidepressivo – NDRI", presentations: ["150mg cp", "300mg cp"] },
  { generic: "Mirtazapina", commercial: ["Remeron", "Mirtazan"], class: "Antidepressivo noradrenérgico", presentations: ["15mg cp", "30mg cp"] },
  { generic: "Haloperidol", commercial: ["Haldol", "Haloperix"], class: "Antipsicótico típico", presentations: ["1mg cp", "5mg cp", "5mg/ml amp"] },
  { generic: "Risperidona", commercial: ["Risperdal", "Riss"], class: "Antipsicótico atípico", presentations: ["1mg cp", "2mg cp", "3mg cp"] },
  { generic: "Olanzapina", commercial: ["Zyprexa", "Olanzax"], class: "Antipsicótico atípico", presentations: ["2,5mg cp", "5mg cp", "10mg cp", "20mg cp"] },
  { generic: "Quetiapina", commercial: ["Seroquel", "Quetix"], class: "Antipsicótico atípico", presentations: ["25mg cp", "100mg cp", "200mg cp"] },
  { generic: "Clozapina", commercial: ["Leponex", "Clozapin"], class: "Antipsicótico atípico (refratário)", presentations: ["25mg cp", "100mg cp"] },
  { generic: "Diazepam", commercial: ["Valium", "Dienpax"], class: "Benzodiazepínico – Ansiolítico", presentations: ["5mg cp", "10mg cp", "5mg/ml amp"] },
  { generic: "Clonazepam", commercial: ["Rivotril", "Klonopin"], class: "Benzodiazepínico – Anticonvulsivante", presentations: ["0,5mg cp", "2mg cp", "2,5mg/ml gotas"] },
  { generic: "Lorazepam", commercial: ["Lorax", "Ativan"], class: "Benzodiazepínico", presentations: ["1mg cp", "2mg cp", "4mg/ml amp"] },
  { generic: "Midazolam", commercial: ["Dormonid", "Versed"], class: "Benzodiazepínico – Sedação / Procedimento", presentations: ["15mg/3ml amp", "5mg/5ml amp"] },
  { generic: "Fenitoína", commercial: ["Hidantal", "Epelin"], class: "Anticonvulsivante", presentations: ["100mg cp", "250mg/5ml amp"] },
  { generic: "Ácido valproico / Valproato de sódio", commercial: ["Depakene", "Depakote"], class: "Anticonvulsivante / Estabilizador de humor", presentations: ["250mg cp", "500mg cp", "250mg/5ml xarope"] },
  { generic: "Carbamazepina", commercial: ["Tegretol", "Carbatrol"], class: "Anticonvulsivante / Estabilizador de humor", presentations: ["200mg cp", "400mg cp"] },
  { generic: "Lamotrigina", commercial: ["Lamictal", "Lage"], class: "Anticonvulsivante", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Levetiracetam", commercial: ["Keppra", "Levetiratol"], class: "Anticonvulsivante", presentations: ["250mg cp", "500mg cp", "1000mg cp"] },
  { generic: "Fenobarbital", commercial: ["Gardenal", "Luminal"], class: "Anticonvulsivante – Barbitúrico", presentations: ["50mg cp", "100mg cp", "200mg/ml amp"] },
  { generic: "Gabapentina", commercial: ["Neurontin", "Gabanox"], class: "Anticonvulsivante / Neuro-álgico", presentations: ["300mg cp", "400mg cp", "600mg cp"] },
  { generic: "Pregabalina", commercial: ["Lyrica", "Pragiola"], class: "Neuro-álgico / Anticonvulsivante", presentations: ["75mg cp", "150mg cp", "300mg cp"] },
  { generic: "Carbonato de lítio", commercial: ["Carbolithium", "Litiocar"], class: "Estabilizador de humor", presentations: ["300mg cp"] },

  // Antiemeticos / Gastro
  { generic: "Ondansetrona", commercial: ["Zofran", "Vonau"], class: "Antiemético – Antagonista 5-HT3", presentations: ["4mg cp", "8mg cp", "4mg/2ml amp"] },
  { generic: "Metoclopramida", commercial: ["Plasil", "Meticop"], class: "Antiemético – Procinético", presentations: ["10mg cp", "10mg/2ml amp", "4mg/ml gotas"] },
  { generic: "Bromoprida", commercial: ["Digesan", "Plamet"], class: "Antiemético – Procinético", presentations: ["10mg cp", "5mg/ml xarope"] },
  { generic: "Dimenidrinato + Piridoxina", commercial: ["Dramin B6", "Bonjesta"], class: "Antiemético – Gravidez", presentations: ["50+10mg cp"] },
  { generic: "Omeprazol", commercial: ["Losec", "Peprazol"], class: "Inibidor da bomba de prótons", presentations: ["20mg cp", "40mg cp", "40mg amp"] },
  { generic: "Pantoprazol", commercial: ["Pantozol", "Pantopak"], class: "Inibidor da bomba de prótons", presentations: ["20mg cp", "40mg cp", "40mg amp"] },
  { generic: "Ranitidina", commercial: ["Antak", "Rantec"], class: "Bloqueador H2", presentations: ["150mg cp", "300mg cp"] },
  { generic: "Sucralfato", commercial: ["Epigastrol", "Sucrafilm"], class: "Protetor de mucosa gástrica", presentations: ["1g cp", "200mg/ml susp"] },
  { generic: "Lactulose", commercial: ["Lactulona", "Duphalac"], class: "Laxante osmótico", presentations: ["667mg/ml xarope"] },
  { generic: "Bisacodil", commercial: ["Dulcolax", "Laxil"], class: "Laxante estimulante", presentations: ["5mg cp", "10mg suposit"] },
  { generic: "Loperamida", commercial: ["Imosec", "Imodium"], class: "Antidiarreico", presentations: ["2mg cp"] },
  { generic: "Mesalazina", commercial: ["Pentasa", "Asacol"], class: "Anti-inflamatório intestinal", presentations: ["500mg cp", "800mg cp", "250mg enema"] },
  { generic: "Domperidona", commercial: ["Motilium", "Motinorm"], class: "Procinético – Antiemético", presentations: ["10mg cp", "5mg/5ml susp"] },

  // Respiratório
  { generic: "Salbutamol", commercial: ["Ventolin", "Aerolin"], class: "Broncodilatador – β2 curta ação", presentations: ["100mcg/dose aerossol", "2mg cp", "5mg/ml nebulização"] },
  { generic: "Formoterol", commercial: ["Foradil", "Oxeze"], class: "Broncodilatador – β2 longa ação", presentations: ["12mcg/dose cáps inal."] },
  { generic: "Salmeterol", commercial: ["Serevent", "Salbulair"], class: "Broncodilatador – β2 longa ação", presentations: ["50mcg/dose aerossol"] },
  { generic: "Ipratrópio", commercial: ["Atrovent", "Ipravent"], class: "Broncodilatador – Anticolinérgico", presentations: ["0,25mg/ml neb", "20mcg/dose aerossol"] },
  { generic: "Tiotrópio", commercial: ["Spiriva", "Tiobrom"], class: "Broncodilatador – Anticolinérgico longa ação", presentations: ["18mcg/cáps inal."] },
  { generic: "Budesonida", commercial: ["Pulmicort", "Noex"], class: "Corticoide inalatório", presentations: ["200mcg/dose aerossol", "0,25mg/ml neb"] },
  { generic: "Fluticasona", commercial: ["Flixotide", "Fluspaz"], class: "Corticoide inalatório", presentations: ["250mcg/dose aerossol"] },
  { generic: "Aminofilina", commercial: ["Aminofilina", "Truphylline"], class: "Broncodilatador – Xantina", presentations: ["240mg/10ml amp"] },
  { generic: "Montelucaste", commercial: ["Singulair", "Montelair"], class: "Antiasmático – Antagonista leucotrieno", presentations: ["5mg cp", "10mg cp"] },
  { generic: "N-acetilcisteína", commercial: ["Fluimucil", "Acetilcisteína"], class: "Mucolítico / Antioxidante", presentations: ["200mg sachê", "600mg sachê", "300mg/3ml amp"] },

  // Urológico / Nefrológico
  { generic: "Tansulosina", commercial: ["Uroflux", "Flomax"], class: "Alfa-1 bloqueador – HPB", presentations: ["0,4mg cp"] },
  { generic: "Finasterida", commercial: ["Proscar", "Propecia"], class: "Inibidor 5-alfa redutase – HPB", presentations: ["5mg cp"] },
  { generic: "Dutasterida", commercial: ["Avodart", "Dasteride"], class: "Inibidor 5-alfa redutase – HPB", presentations: ["0,5mg cp"] },
  { generic: "Solifenacina", commercial: ["Vesicare", "Soliflex"], class: "Anticolinérgico – Bexiga hiperativa", presentations: ["5mg cp", "10mg cp"] },
  { generic: "Oxybutinina", commercial: ["Retemic", "Ditropan"], class: "Anticolinérgico – Bexiga hiperativa", presentations: ["5mg cp"] },

  // Neurológico
  { generic: "Levodopa + Carbidopa", commercial: ["Sinemet", "Prolopa"], class: "Antiparkinsôniano", presentations: ["100+25mg cp", "200+50mg cp"] },
  { generic: "Donepezila", commercial: ["Aricept", "Donezil"], class: "Inibidor AChE – Alzheimer", presentations: ["5mg cp", "10mg cp"] },
  { generic: "Memantina", commercial: ["Ebixa", "Namenda"], class: "Antagonista NMDA – Alzheimer", presentations: ["10mg cp"] },
  { generic: "Sumatriptano", commercial: ["Imigran", "Sumatriptan"], class: "Triptano – Enxaqueca", presentations: ["50mg cp", "100mg cp"] },
  { generic: "Topiramato", commercial: ["Topamax", "Topirol"], class: "Anticonvulsivante / Profilaxia enxaqueca", presentations: ["25mg cp", "50mg cp", "100mg cp"] },

  // Hematológico
  { generic: "Ácido fólico", commercial: ["Foltrin", "Vitafolin"], class: "Vitamina B9 – Hematopoético", presentations: ["5mg cp"] },
  { generic: "Sulfato ferroso", commercial: ["Combiron", "Ferrovin"], class: "Suplemento de ferro", presentations: ["40mg Fe/cp", "200mg cp"] },
  { generic: "Vitamina B12 (Cianocobalamina)", commercial: ["Rubranova", "Injet B12"], class: "Hematopoético – Vitamina B12", presentations: ["1000mcg/2ml amp", "1000mcg cp"] },
  { generic: "Eritropoetina humana recombinante", commercial: ["Eprex", "Hemax"], class: "Estimulante eritropoese", presentations: ["2000 UI amp", "4000 UI amp"] },

  // Reumatológico / Imunológico
  { generic: "Metotrexato", commercial: ["Metoject", "Rheumatrex"], class: "Imunossupressor / DMARDs", presentations: ["2,5mg cp", "7,5mg/0,15ml ser pré"] },
  { generic: "Hidroxicloroquina", commercial: ["Reuquinol", "Plaquenil"], class: "DMARDs – Antimalárico", presentations: ["400mg cp"] },
  { generic: "Leflunomida", commercial: ["Arava", "Leflunomix"], class: "DMARDs", presentations: ["10mg cp", "20mg cp"] },
  { generic: "Azatioprina", commercial: ["Imuran", "Azatioprina"], class: "Imunossupressor", presentations: ["50mg cp"] },
  { generic: "Ciclosporina", commercial: ["Sandimmun", "Neoral"], class: "Imunossupressor – Inibidor calcineurina", presentations: ["25mg cp", "50mg cp", "100mg cp"] },
  { generic: "Colchicina", commercial: ["Colchimed", "Artrichine"], class: "Antigotoso / Anti-inflamatório", presentations: ["0,5mg cp", "1mg cp"] },
  { generic: "Alopurinol", commercial: ["Zyloprim", "Milurit"], class: "Antigotoso – Inibidor xantina oxidase", presentations: ["100mg cp", "300mg cp"] },
  { generic: "Febuxostate", commercial: ["Adenuric", "Uloric"], class: "Antigotoso – Inibidor xantina oxidase", presentations: ["40mg cp", "80mg cp"] },

  // Outros
  { generic: "Prometazina", commercial: ["Fenergan", "Promet"], class: "Anti-histamínico / Antiemético", presentations: ["25mg cp", "25mg/2ml amp"] },
  { generic: "Loratadina", commercial: ["Claritin", "Loratin"], class: "Anti-histamínico não sedativo", presentations: ["10mg cp", "1mg/ml xarope"] },
  { generic: "Cetirizina", commercial: ["Zyrtec", "Cetrizin"], class: "Anti-histamínico não sedativo", presentations: ["10mg cp"] },
  { generic: "Desloratadina", commercial: ["Desalex", "Aerius"], class: "Anti-histamínico", presentations: ["5mg cp", "0,5mg/ml xarope"] },
  { generic: "Fexofenadina", commercial: ["Allegra", "Telfast"], class: "Anti-histamínico", presentations: ["60mg cp", "120mg cp", "180mg cp"] },
  { generic: "Glicose 50%", commercial: ["Glicose 50%", "Dextrose 50%"], class: "Solução EV – Hipoglicemia", presentations: ["10ml amp", "250ml fr"] },
  { generic: "Soro fisiológico 0,9%", commercial: ["NaCl 0,9%", "SF 0,9%"], class: "Solução EV / Nebulização", presentations: ["100ml", "250ml", "500ml", "1000ml"] },
  { generic: "Ringer com lactato", commercial: ["Ringer Lactato", "Solução de Hartmann"], class: "Solução EV – Reposição volêmica", presentations: ["500ml", "1000ml"] },
  { generic: "Albumina humana 20%", commercial: ["Buminate", "Albusol"], class: "Expansor plasmático", presentations: ["50ml fr 20%", "100ml fr 20%"] },
  { generic: "Potássio (KCl 19,1%)", commercial: ["KCl 19,1%", "Cloreto de potássio"], class: "Reposição eletrolítica EV", presentations: ["10ml amp", "20ml amp"] },
  { generic: "Gluconato de cálcio 10%", commercial: ["Gluconato de cálcio", "Calcium gluconate"], class: "Reposição de cálcio / Cardioprotção EV", presentations: ["10ml amp"] },
  { generic: "Omeprazol EV", commercial: ["Losec EV", "Peprazol EV"], class: "IBP EV – Hemorragia digestiva alta", presentations: ["40mg amp"] },
  { generic: "Vitamina C (ácido ascórbico)", commercial: ["Redoxon", "Cebion"], class: "Vitamina C", presentations: ["500mg cp", "1g cp", "100mg/ml amp"] },
  { generic: "Vitamina D3 (Colecalciferol)", commercial: ["Depura", "Addera D3"], class: "Vitamina D", presentations: ["200 UI/ml gotas", "1000 UI cp", "7000 UI cp"] },
  { generic: "Zinco", commercial: ["Zincovit", "Galena Zinco"], class: "Suplemento mineral", presentations: ["40mg cp"] },
  { generic: "Magnésio (sulfato de magnésio)", commercial: ["MgSO4", "Sulfato de magnésio"], class: "Anticonvulsivante / Tocolítico / Reposição EV", presentations: ["1g/2ml amp", "2g/4ml amp", "10g amp"] },
  { generic: "Rivastigmina", commercial: ["Exelon", "Rivast"], class: "Inibidor AChE – Alzheimer/Parkinson", presentations: ["1,5mg cp", "3mg cp", "4,6mg/24h patch"] },
  { generic: "Brometo de ipratrópio + Salbutamol", commercial: ["Combivent", "Duovent"], class: "Broncodilatador combinado", presentations: ["500mcg+2,5mg/2,5ml neb"] },
  { generic: "Acetato de medroxiprogesterona", commercial: ["Provera", "Depo-Provera"], class: "Progestágeno", presentations: ["5mg cp", "10mg cp", "150mg/ml amp"] },
  { generic: "Anticoncepcional combinado (EE + Gestodeno)", commercial: ["Femiane", "Harmonet"], class: "Contraceptivo hormonal oral combinado", presentations: ["21 cp"] },
  { generic: "Levonorgestrel", commercial: ["Postinor-2", "Pilem"], class: "Contraceptivo de emergência", presentations: ["1,5mg cp"] },
  { generic: "Misoprostol", commercial: ["Cytotec", "Misoprofen"], class: "Prostaglandina – Protetor gástrico / Obstetrícia", presentations: ["200mcg cp"] },
  { generic: "Ocitocina", commercial: ["Syntocinon", "Oxitocina"], class: "Ocitócico", presentations: ["5 UI/ml amp"] },
  { generic: "Betaistina", commercial: ["Betaserc", "Verti-OKi"], class: "Anti-vertiginoso – Agonista histamínico H1", presentations: ["8mg cp", "16mg cp", "24mg cp"] },
  { generic: "Ondansetrona sublingual", commercial: ["Vonau Flash", "Zofran ODT"], class: "Antiemético sublingual", presentations: ["4mg ODT", "8mg ODT"] },
];

/** Flat list for autocomplete: includes generic name + commercial names */
export function getMedAutocompleteSuggestions(query: string): Medication[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return MEDICATIONS.filter((m) => {
    const gen = m.generic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const comm = m.commercial.join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return gen.includes(q) || comm.includes(q);
  }).slice(0, 8);
}
