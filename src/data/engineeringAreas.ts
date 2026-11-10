
export interface EngineeringArea {
  id: string
  number: string
  name: string
  shortName: string
  description: string
  overview: string
  fields: string[]
  project: string
  projectDescription: string
}

export const engineeringAreas: EngineeringArea[] = [
  {
    id: 'aerospace',
    number: '01',
    name: 'Engenharia Aeroespacial',
    shortName: 'Aeroespacial',
    description:
      'Explore sistemas espaciais, aeronaves, dinâmica orbital e tecnologias de voo.',
    overview:
      'A Engenharia Aeroespacial trabalha com o projeto, desenvolvimento e operação de veículos e sistemas capazes de voar na atmosfera terrestre ou operar no espaço.',
    fields: [
      'Mecânica orbital',
      'Aerodinâmica e propulsão',
      'Estruturas aeroespaciais',
      'Sistemas de controle',
      'Satélites e sistemas espaciais',
    ],
    project: 'Anatomia de um satélite',
    projectDescription:
      'Explore a estrutura de um satélite artificial, identificando seus subsistemas, componentes e funções.',
  },
  {
    id: 'automotive',
    number: '02',
    name: 'Engenharia Automotiva',
    shortName: 'Automotiva',
    description:
      'Descubra os sistemas mecânicos, estruturas, propulsão e dinâmica dos veículos.',
    overview:
      'A Engenharia Automotiva envolve o desenvolvimento de veículos, desde seus componentes mecânicos até os sistemas de propulsão, segurança, controle e desempenho.',
    fields: [
      'Dinâmica veicular',
      'Motores e propulsão',
      'Estruturas e materiais',
      'Sistemas de transmissão',
      'Controle automotivo',
    ],
    project: 'Anatomia de um veículo',
    projectDescription:
      'Conheça os principais sistemas de um automóvel e como eles trabalham em conjunto.',
  },
  {
    id: 'energy',
    number: '03',
    name: 'Engenharia de Energia',
    shortName: 'Energia',
    description:
      'Entenda a geração, conversão, armazenamento e distribuição de energia.',
    overview:
      'A Engenharia de Energia estuda os processos de geração, conversão, transmissão, armazenamento e utilização eficiente de diferentes formas de energia.',
    fields: [
      'Sistemas de geração',
      'Energias renováveis',
      'Termodinâmica',
      'Conversão energética',
      'Armazenamento de energia',
    ],
    project: 'Sistema de conversão energética',
    projectDescription:
      'Explore um sistema de geração de energia e acompanhe o caminho da conversão energética.',
  },
  {
    id: 'electronics',
    number: '04',
    name: 'Engenharia Eletrônica',
    shortName: 'Eletrônica',
    description:
      'Explore circuitos, sensores, sistemas embarcados, instrumentação e automação.',
    overview:
      'A Engenharia Eletrônica desenvolve circuitos, dispositivos e sistemas capazes de adquirir, processar e transmitir sinais e informações.',
    fields: [
      'Circuitos eletrônicos',
      'Sistemas embarcados',
      'Instrumentação',
      'Processamento de sinais',
      'Automação e controle',
    ],
    project: 'Sistema eletrônico interativo',
    projectDescription:
      'Conheça os componentes de um circuito eletrônico e suas relações dentro de um sistema.',
  },
  {
    id: 'software',
    number: '05',
    name: 'Engenharia de Software',
    shortName: 'Software',
    description:
      'Conheça a arquitetura, organização e construção de sistemas computacionais.',
    overview:
      'A Engenharia de Software aplica princípios sistemáticos de engenharia para especificar, projetar, desenvolver, testar, manter e evoluir sistemas de software.',
    fields: [
      'Arquitetura de software',
      'Algoritmos e estruturas de dados',
      'Engenharia de requisitos',
      'Banco de dados',
      'Testes e qualidade de software',
    ],
    project: 'Arquitetura de um sistema',
    projectDescription:
      'Explore a estrutura de um sistema computacional e as relações entre seus diferentes módulos.',
  },
]
