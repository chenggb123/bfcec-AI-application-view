import fs from 'fs'
import path from 'path'
import type { Product } from '@/types'

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

const SEED_PRODUCTS: Product[] = [
  {
    id: 'smart-qms',
    name: '智能质量管理系统',
    nameEn: 'Smart QMS',
    excerpt: '全流程质量管控平台，覆盖来料检验、过程控制与出厂审核。',
    excerptEn: 'End-to-end quality management covering incoming inspection, process control, and outgoing audit.',
    description: '智能质量管理系统是一个面向制造企业的全流程质量管控平台。系统覆盖来料检验（IQC）、过程控制（IPQC）、出厂审核（OQC）三大环节，实现质量数据的实时采集、自动判定与追溯分析。通过与 MES、ERP 系统的深度集成，打通从供应商到客户的全链路质量信息流。',
    descriptionEn: 'Smart QMS is a comprehensive quality management platform for manufacturing enterprises. It covers incoming inspection (IQC), in-process quality control (IPQC), and outgoing quality audit (OQC), enabling real-time data collection, automated judgment, and traceability analysis. Deep integration with MES and ERP systems connects the full quality information chain from supplier to customer.',
    category: '智能质量',
    categoryEn: 'Smart Quality',
    scenario: '',
    scenarioEn: '',
    recommended: true,
    status: 'published',
    screenshots: [],
    videoUrl: '',
    benefits: [
      { label: '缺陷率降低', labelEn: 'Defect Rate Reduction', value: 42, unit: '%', unitEn: '%' },
      { label: '检验效率提升', labelEn: 'Inspection Efficiency', value: 65, unit: '%', unitEn: '%' },
      { label: '年节约成本', labelEn: 'Annual Cost Savings', value: 280, unit: ' 万元', unitEn: ' 10K CNY' },
    ],
    before: '传统质量检验依赖人工记录与纸质报告，数据分散在多个系统，质量问题追溯耗时长，跨部门协同效率低。',
    beforeEn: 'Traditional quality inspection relied on manual records and paper reports. Data was scattered across systems. Quality issue tracing took significant time. Cross-department collaboration was inefficient.',
    after: '实现全流程数字化质量管控，数据实时采集自动判定，问题秒级追溯，与MES/ERP深度集成打通全链路信息流。',
    afterEn: 'Achieved full digital quality control with real-time data collection and auto-judgment. Issue tracing in seconds. Deep integration with MES/ERP connects the full-chain information flow.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
  {
    id: 'ai-assistant',
    name: 'AI 智能助手',
    nameEn: 'AI Assistant Bot',
    excerpt: '基于大语言模型的企业知识问答与任务辅助机器人。',
    excerptEn: 'LLM-powered enterprise knowledge Q&A and task assistance bot.',
    description: 'AI 智能助手是面向企业内部的知识管理与任务辅助平台。基于最新大语言模型技术，结合企业私有知识库进行 RAG（检索增强生成），能够精准回答业务问题、辅助文档撰写、执行数据查询与简单任务自动化。支持多轮对话、上下文记忆与权限管控。',
    descriptionEn: 'AI Assistant Bot is an enterprise knowledge management and task assistance platform. Built on the latest LLM technology with RAG (Retrieval-Augmented Generation) over private knowledge bases, it accurately answers business questions, assists with document drafting, performs data queries, and automates simple tasks. Supports multi-turn conversation, context memory, and access control.',
    category: '问答机器人',
    categoryEn: 'Q&A Bot',
    scenario: '',
    recommended: true,
    scenarioEn: '',
    status: 'published',
    screenshots: [],
    videoUrl: '',
    benefits: [
      { label: '问题解决率', labelEn: 'Resolution Rate', value: 87, unit: '%', unitEn: '%' },
      { label: '平均响应时间', labelEn: 'Avg Response Time', value: 3.2, unit: 's', unitEn: 's' },
      { label: '月均服务次数', labelEn: 'Monthly Queries', value: 15000, unit: '+', unitEn: '+' },
    ],
    before: '员工遇到业务问题需跨部门咨询，平均等待4小时以上，重复性问题占用大量人力，知识分散在个人经验中无法沉淀。',
    beforeEn: 'Employees faced 4+ hour wait times for cross-department consultations. Repetitive questions consumed significant manpower. Knowledge was siloed in individual experience without institutionalization.',
    after: 'AI助手秒级响应常见问题，问题解决率87%，月均服务15000+次，企业知识持续沉淀到知识库形成组织记忆。',
    afterEn: 'AI assistant responds to common questions in seconds. 87% resolution rate. 15,000+ monthly queries served. Enterprise knowledge continuously accumulates into the knowledge base as organizational memory.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
  {
    id: 'smart-factory',
    name: '智能工厂平台',
    nameEn: 'Smart Factory Platform',
    excerpt: '实时生产监控、设备预测性维护与能源优化管理平台。',
    excerptEn: 'Real-time production monitoring, predictive maintenance, and energy optimization.',
    description: '智能工厂平台提供从设备层到管理层的完整数字化解决方案。通过工业物联网（IIoT）采集设备实时数据，结合机器学习模型实现预测性维护与异常检测；能源管理模块通过多维度分析优化用能策略；可视化看板为管理层提供实时决策支持。',
    descriptionEn: 'Smart Factory Platform delivers a complete digital solution from the equipment layer to the management layer. It collects real-time equipment data via IIoT, applies ML models for predictive maintenance and anomaly detection, optimizes energy strategy through multi-dimensional analysis, and provides real-time decision support dashboards for management.',
    category: '智能工厂',
    categoryEn: 'Smart Factory',
    scenario: '',
    recommended: true,
    scenarioEn: '',
    status: 'published',
    screenshots: [],
    videoUrl: '',
    benefits: [
      { label: '设备停机减少', labelEn: 'Downtime Reduction', value: 35, unit: '%', unitEn: '%' },
      { label: '产能利用率', labelEn: 'Capacity Utilization', value: 92, unit: '%', unitEn: '%' },
      { label: '能耗降低', labelEn: 'Energy Savings', value: 18, unit: '%', unitEn: '%' },
    ],
    before: '设备运行状态靠人工巡检，故障发现滞后，维护以事后维修为主，能耗数据粗放管理，缺乏精细化运营手段。',
    beforeEn: 'Equipment status relied on manual inspections. Fault detection was reactive. Maintenance was post-incident. Energy data was managed coarsely without refined operational controls.',
    after: '实现设备预测性维护，停机减少35%，产能利用率达92%，能耗降低18%，管理层通过实时看板掌握全局生产状态。',
    afterEn: 'Achieved predictive maintenance with 35% downtime reduction. Capacity utilization reached 92%. Energy savings of 18%. Management monitors global production status via real-time dashboards.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
  {
    id: 'efficiency-toolkit',
    name: '效率工具集',
    nameEn: 'Efficiency Toolkit',
    excerpt: '一体化办公效率平台，含自动化工作流、文档协作与数据报表。',
    excerptEn: 'All-in-one office productivity suite with workflow automation, doc collaboration, and analytics.',
    description: '效率工具集是一体化办公效率提升平台，整合自动化工作流引擎、实时文档协作、智能数据报表三大核心模块。通过低代码方式配置审批流、通知流与数据流转，降低跨部门协作摩擦。',
    descriptionEn: 'Efficiency Toolkit is an all-in-one productivity platform integrating automated workflow engine, real-time document collaboration, and intelligent analytics. Configure approval flows, notifications, and data pipelines with low-code to reduce cross-departmental friction.',
    category: '效率工具',
    categoryEn: 'Efficiency Tools',
    scenario: '',
    recommended: false,
    scenarioEn: '',
    status: 'draft',
    screenshots: [],
    videoUrl: '',
    benefits: [],
    before: '跨部门审批靠邮件和纸质单流转，流程不透明，平均审批周期3-5天，文档版本混乱，数据报表靠手工整理。',
    beforeEn: 'Cross-department approvals relied on email and paper forms. Processes were opaque. Average approval cycle took 3-5 days. Document versioning was chaotic. Reports required manual compilation.',
    after: '低代码配置化审批流将周期缩短至半天内，实时文档协作消除版本冲突，智能报表一键生成，跨部门协作摩擦大幅降低。',
    afterEn: 'Low-code approval flows shortened cycles to within half a day. Real-time doc collaboration eliminated version conflicts. One-click intelligent reports. Cross-department friction significantly reduced.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
  {
    id: 'smart-service',
    name: '智能服务台',
    nameEn: 'Intelligent Service Desk',
    excerpt: 'IT 运维与业务服务统一管理，智能路由、自动分派、SLA 监控。',
    excerptEn: 'Unified IT and business service management with smart routing and SLA monitoring.',
    description: '智能服务台将 IT 运维与业务服务请求整合至统一管理平台。通过智能路由引擎自动识别工单类型并分派至对应处理人；SLA 实时监控确保服务时效；知识库与 AI 建议帮助一线人员快速解决问题。',
    descriptionEn: 'Intelligent Service Desk unifies IT operations and business service requests in one platform. Smart routing engine auto-classifies and assigns tickets; real-time SLA monitoring ensures service timeliness; knowledge base and AI suggestions help first-line staff resolve issues quickly.',
    category: '智能服务',
    categoryEn: 'Smart Service',
    scenario: '',
    recommended: true,
    scenarioEn: '',
    status: 'published',
    screenshots: [],
    videoUrl: '',
    benefits: [
      { label: '工单处理时效', labelEn: 'Ticket Resolution Time', value: 58, unit: '%', unitEn: '%' },
      { label: '用户满意度', labelEn: 'User Satisfaction', value: 4.6, unit: '/5', unitEn: '/5' },
    ],
    before: 'IT工单靠电话和邮件提交，缺乏统一入口，分配靠人工判断，处理进度不可见，SLA达标率不足60%。',
    beforeEn: 'IT tickets submitted via phone and email with no unified entry. Assignment was manual. Processing progress was invisible. SLA compliance rate below 60%.',
    after: '统一服务台入口，智能路由自动分派工单，处理时效提升58%，用户满意度4.6/5，SLA实时监控确保服务质量。',
    afterEn: 'Unified service desk entry. Smart routing auto-assigns tickets. Processing time improved 58%. User satisfaction 4.6/5. Real-time SLA monitoring ensures service quality.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
  {
    id: 'data-insight',
    name: '数据洞察引擎',
    nameEn: 'Data Insight Engine',
    excerpt: '多源数据聚合分析与可视化平台，支持实时看板与智能预警。',
    excerptEn: 'Multi-source data aggregation and visualization with real-time dashboards and alerts.',
    description: '数据洞察引擎是一个多源数据聚合分析与可视化平台。支持从数据库、API、文件等多种数据源接入，通过 SQL 与拖拽式界面构建分析模型，输出实时看板与智能预警。内置异常检测算法自动识别数据波动。',
    descriptionEn: 'Data Insight Engine is a multi-source data aggregation and visualization platform. It supports data ingestion from databases, APIs, and files, builds analysis models via SQL and drag-and-drop interface, and outputs real-time dashboards with intelligent alerts. Built-in anomaly detection auto-identifies data fluctuations.',
    category: '效率工具',
    categoryEn: 'Efficiency Tools',
    scenario: '',
    recommended: false,
    scenarioEn: '',
    status: 'draft',
    screenshots: [],
    videoUrl: '',
    benefits: [],
    before: '数据分散在数据库、API和文件中，分析靠导出Excel手工处理，报表生成周期以天计，异常发现依赖人工巡检。',
    beforeEn: 'Data was scattered across databases, APIs, and files. Analysis relied on Excel exports with manual processing. Report generation took days. Anomaly detection depended on manual checks.',
    after: '多源数据一键接入，SQL+拖拽构建分析模型，实时看板秒级刷新，内置异常检测算法自动识别数据波动并推送预警。',
    afterEn: 'Multi-source data ingestion in one click. SQL + drag-and-drop builds analysis models. Real-time dashboards with sub-second refresh. Built-in anomaly detection auto-identifies data fluctuations with push alerts.',
    painPoints: '',
    painPointsEn: '',
    solution: '',
    solutionEn: '',
    thumb: '',
  },
]

function readProducts(): Product[] {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8')
    if (!raw.trim()) return SEED_PRODUCTS
    const data = JSON.parse(raw)
    if (!Array.isArray(data) || data.length === 0) return SEED_PRODUCTS
    return data as Product[]
  } catch {
    return SEED_PRODUCTS
  }
}

function writeProducts(products: Product[]): void {
  const dir = path.dirname(PRODUCTS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
}

export function getAllProducts(): Product[] {
  return readProducts()
}

export function getProductById(id: string): Product | undefined {
  return readProducts().find((p) => p.id === id)
}

export function createProduct(p: Product): Product {
  const products = readProducts()
  products.push(p)
  writeProducts(products)
  return p
}

export function updateProduct(id: string, data: Partial<Product>): Product | undefined {
  const products = readProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return undefined
  products[index] = { ...products[index], ...data }
  writeProducts(products)
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const products = readProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false
  products.splice(index, 1)
  writeProducts(products)
  return true
}
